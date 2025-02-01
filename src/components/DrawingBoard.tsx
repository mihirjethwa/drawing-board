import React, { useState, useRef } from "react";
import { Stage, Layer, Rect, Circle, Line, Text, Transformer } from "react-konva";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import { addShape, selectShape, updateShape } from "../app/features/toolSlice";

const DrawingBoard: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedTool, strokeColor, strokeWidth, selectedShapeId, theme, layers, activeLayerId } = useSelector((state: RootState) => state.tool);
  const [currentLine, setCurrentLine] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isHoveringShape, setIsHoveringShape] = useState(false);
  const activeLayer = layers.find((layer) => layer.id === activeLayerId);
  const transformerRef = useRef<any>(null);
  const stageRef = useRef<any>(null);
  const stageBackgroundColor = theme === "light" ? "#ffffff" : "#1e1e1e";

  const handleShapeClick = (id: string) => {
    const activeLayer = layers.find((layer) => layer.id === activeLayerId);
    if (!activeLayer) return;
    const shapeInActiveLayer = activeLayer.shapes.some((shape) => shape.id === id);
    if (!shapeInActiveLayer) {
      alert("You can only interact with shapes in the active layer.");
      return;
    }
    dispatch(selectShape(id));
    if (transformerRef.current && selectedShapeId) {
      const stage = transformerRef.current.getLayer()?.getStage();
      const shapeNode = stage?.findOne(`#${selectedShapeId}`);
      if (shapeNode) {
        transformerRef.current.nodes([shapeNode]);
        transformerRef.current.getLayer()?.batchDraw();
      }
    }
    handleTransformEnd(id);
  };

  const handleTransformEnd = (id: string) => {
    const stage = transformerRef.current?.getLayer()?.getStage();
    const shapeNode = stage?.findOne(`#${id}`);

    if (shapeNode) {
      const newAttrs = shapeNode.attrs;
      dispatch(
        updateShape({
          id,
          updates: {
            x: newAttrs.x,
            y: newAttrs.y,
            width: newAttrs.width || undefined,
            height: newAttrs.height || undefined,
            radius: newAttrs.radius || undefined,
            scaleX: newAttrs.scaleX || 1,
            scaleY: newAttrs.scaleY || 1,
          },
        })
      );
    }
  };

  const handleMouseDown = (e: any) => {
    const stage = e.target.getStage();
    const { x, y } = stage.getPointerPosition();
    const activeLayer = layers.find((layer) => layer.id === activeLayerId);
    if (!activeLayer) return;

    const clickedOnActiveLayerShape = activeLayer.shapes.some((shape) => {
      if (shape.type === "rectangle") {
        return x >= shape.x && x <= shape.x + (shape.width || 0) && y >= shape.y && y <= shape.y + (shape.height || 0);
      } else if (shape.type === "circle") {
        const distance = Math.sqrt(Math.pow(x - shape.x, 2) + Math.pow(y - shape.y, 2));
        return distance <= (shape.radius || 0);
      }
      return false;
    });

    if (clickedOnActiveLayerShape) {
      const clickedShape = activeLayer.shapes.find((shape) => {
        if (shape.type === "rectangle") {
          return x >= shape.x && x <= shape.x + (shape.width || 0) && y >= shape.y && y <= shape.y + (shape.height || 0);
        } else if (shape.type === "circle") {
          const distance = Math.sqrt(Math.pow(x - shape.x, 2) + Math.pow(y - shape.y, 2));
          return distance <= (shape.radius || 0);
        }
        return false;
      });
      if (clickedShape) {
        handleShapeClick(clickedShape.id);
      }
      return;
    }
    // if (e.target === e.target.getStage()) {
    //   dispatch(selectShape(null));
    // }
    // const clickedOnShape = stage.getIntersection({ x, y });
    // if (clickedOnShape) {
    //   return;
    // }

    if (selectedTool === "text") {
      const textContent = prompt("Enter text:");
      if (textContent) {
        dispatch(
          addShape({
            id: `${Date.now()}`,
            type: "text",
            x,
            y,
            text: textContent,
            fontSize: 20,
            fill: strokeColor,
          })
        );
      }
    } else if (selectedTool === "freehand") {
      setIsDrawing(true);
      setCurrentLine([x, y]);
    } else if (selectedTool === "rectangle") {
      setIsDrawing(true);
      dispatch(
        addShape({
          id: `${Date.now()}`,
          type: "rectangle",
          x,
          y,
          width: 0,
          height: 0,
          fill: strokeColor,
        })
      );
    } else if (selectedTool === "circle") {
      setIsDrawing(true);
      dispatch(
        addShape({
          id: `${Date.now()}`,
          type: "circle",
          x,
          y,
          radius: 0,
          fill: strokeColor,
        })
      );
    }
  };

  const handleMouseMove = (e: any) => {
    if (!activeLayer || !isDrawing) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    if (selectedTool === "freehand") {
      setCurrentLine((prevLine) => [...prevLine, point.x, point.y]);
    } else if (selectedTool === "rectangle") {
      const activeLayer = layers.find((layer) => layer.id === activeLayerId);
      if (activeLayer) {
        const lastShape = activeLayer.shapes[activeLayer.shapes.length - 1];
        if (lastShape.type === "rectangle") {
          const newWidth = point.x - lastShape.x;
          const newHeight = point.y - lastShape.y;
          dispatch(
            updateShape({
              id: lastShape.id,
              updates: { width: newWidth, height: newHeight },
            })
          );
        }
      }
    } else if (selectedTool === "circle") {
      const activeLayer = layers.find((layer) => layer.id === activeLayerId);
      if (activeLayer) {
        const lastShape = activeLayer.shapes[activeLayer.shapes.length - 1];
        if (lastShape.type === "circle") {
          const newRadius = Math.sqrt(Math.pow(point.x - lastShape.x, 2) + Math.pow(point.y - lastShape?.y, 2));
          dispatch(
            updateShape({
              id: lastShape.id,
              updates: { radius: newRadius },
            })
          );
        }
      }
    }
  };

  const handleMouseUp = () => {
    if (!activeLayer || !isDrawing) return;
    setIsDrawing(false);
    if (selectedTool === "freehand") {
      dispatch(
        addShape({
          id: `${Date.now()}`,
          type: "freehand",
          points: currentLine,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
        })
      );
      setCurrentLine([]);
    }
  };

  return (
    <Stage
      ref={stageRef}
      width={window.innerWidth}
      height={window.innerHeight - 50}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        backgroundColor: stageBackgroundColor,
        cursor: isDrawing ? "crosshair" : isHoveringShape ? "move" : "default",
      }}
    >
      {layers.map((layer) => (
        <Layer key={layer.id} visible={layer.isVisible}>
          {layer.shapes.map((shape) =>
            shape.type === "rectangle" ? (
              <Rect
                key={shape.id}
                id={shape.id}
                x={shape.x}
                y={shape.y}
                width={shape.width || 0}
                height={shape.height || 0}
                fill={shape.fill}
                draggable={layer.id === activeLayerId}
                onDragEnd={(e) => {
                  const newX = e.target.x();
                  const newY = e.target.y();
                  dispatch(
                    updateShape({
                      id: shape.id,
                      updates: { x: newX, y: newY },
                    })
                  );
                }}
                onClick={() => handleShapeClick(shape.id)}
                onTransformEnd={() => handleTransformEnd(shape.id)}
                onMouseEnter={(e) => {
                  const stage = e.target.getStage();
                  if (stage) {
                    const container = stage.container();
                    container.style.cursor = layer.id === activeLayerId ? "move" : "default";
                  }
                }}
                onMouseleave={(e: any) => {
                  const stage = e.target.getStage();
                  if (stage) {
                    const container = stage.container();
                    container.style.cursor = "default";
                  }
                }}
              />
            ) : shape.type === "circle" ? (
              <Circle
                key={shape.id}
                id={shape.id}
                x={shape.x}
                y={shape.y}
                radius={shape.radius || 0}
                fill={shape.fill}
                draggable={layer.id === activeLayerId}
                onDragEnd={(e) => {
                  const newX = e.target.x();
                  const newY = e.target.y();
                  dispatch(
                    updateShape({
                      id: shape.id,
                      updates: { x: newX, y: newY },
                    })
                  );
                }}
                onClick={() => handleShapeClick(shape.id)}
                onTransformEnd={() => handleTransformEnd(shape.id)}
                onMouseEnter={(e) => {
                  const stage = e.target.getStage();
                  if (stage) {
                    const container = stage.container();
                    container.style.cursor = layer.id === activeLayerId ? "move" : "default";
                  }
                }}
                onMouseleave={(e: any) => {
                  const stage = e.target.getStage();
                  if (stage) {
                    const container = stage.container();
                    container.style.cursor = "default";
                  }
                }}
              />
            ) : shape.type === "freehand" ? (
              <Line
                key={shape.id}
                id={shape.id}
                points={shape.points || []}
                stroke={shape.stroke || "black"}
                strokeWidth={shape.strokeWidth || 5}
                tension={0.5}
                lineCap='round'
                lineJoin='round'
                onClick={() => handleShapeClick(shape.id)}
                onTransformEnd={() => handleTransformEnd(shape.id)}
                onMouseEnter={() => setIsHoveringShape(true)}
                onMouseLeave={() => setIsHoveringShape(false)}
                draggable={layer.id === activeLayerId}
                onDragEnd={(e) => {
                  const newX = e.target.x();
                  const newY = e.target.y();
                  dispatch(
                    updateShape({
                      id: shape.id,
                      updates: { x: newX, y: newY },
                    })
                  );
                }}
              />
            ) : (
              <Text
                key={shape.id}
                id={shape.id}
                x={shape.x}
                y={shape.y}
                text={shape.text || ""}
                fontSize={shape.fontSize || 20}
                fill={shape.fill || "black"}
                draggable={layer.id === activeLayerId}
                onDragEnd={(e) => {
                  const newX = e.target.x();
                  const newY = e.target.y();
                  dispatch(
                    updateShape({
                      id: shape.id,
                      updates: { x: newX, y: newY },
                    })
                  );
                }}
                onClick={() => handleShapeClick(shape.id)}
                onTransformEnd={() => handleTransformEnd(shape.id)}
                onMouseEnter={(e) => {
                  const stage = e.target.getStage();
                  if (stage) {
                    const container = stage.container();
                    container.style.cursor = layer.id === activeLayerId ? "move" : "default";
                  }
                }}
                onMouseleave={(e: any) => {
                  const stage = e.target.getStage();
                  if (stage) {
                    const container = stage.container();
                    container.style.cursor = "default";
                  }
                }}
              />
            )
          )}
          {selectedTool === "freehand" && isDrawing && <Line points={currentLine} stroke={strokeColor} strokeWidth={strokeWidth} tension={0.5} lineCap='round' lineJoin='round' />}
          {selectedShapeId && (
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 5 || newBox.height < 5) {
                  return oldBox;
                }
                return newBox;
              }}
            />
          )}
        </Layer>
      ))}
    </Stage>
  );
};

export default DrawingBoard;
