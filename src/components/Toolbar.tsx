import React from "react";
import "./styles/toolbar.css";
import { useDispatch, useSelector } from "react-redux";
import { setTool, setStrokeColor, setStrokeWidth, undo, redo, deleteShape, toggleTheme } from "../app/features/toolSlice";
import { RootState } from "../app/store";
import { FaPenAlt } from "react-icons/fa";
import { LuRectangleHorizontal } from "react-icons/lu";
import { FaRegCircle } from "react-icons/fa";
import { BsAlphabet } from "react-icons/bs";
import { LuTextCursor } from "react-icons/lu";
import { LuUndo2 } from "react-icons/lu";
import { LuRedo2 } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import { FaDownload } from "react-icons/fa6";
import { FaMoon } from "react-icons/fa6";
import { FaSun } from "react-icons/fa6";
import Konva from "konva";

const Toolbar: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedTool, strokeColor, strokeWidth, selectedShapeId, theme, layers } = useSelector((state: RootState) => state.tool);
  const handleDownload = () => {
    if (layers.filter((layer) => layer.isVisible).length === 0) {
      alert("No visible layers to export.");
      return;
    }
    const stage = new Konva.Stage({
      width: window.innerWidth,
      height: window.innerHeight - 50,
      container: document.createElement("div"),
    });

    layers.forEach((layer) => {
      if (layer.isVisible) {
        const konvaLayer = new Konva.Layer();

        layer.shapes.forEach((shape) => {
          if (shape.type === "rectangle") {
            const rect = new Konva.Rect({
              x: shape.x,
              y: shape.y,
              width: shape.width || 0,
              height: shape.height || 0,
              fill: shape.fill,
            });
            konvaLayer.add(rect);
          } else if (shape.type === "circle") {
            const circle = new Konva.Circle({
              x: shape.x,
              y: shape.y,
              radius: shape.radius || 0,
              fill: shape.fill,
            });
            konvaLayer.add(circle);
          } else if (shape.type === "freehand") {
            const line = new Konva.Line({
              points: shape.points || [],
              stroke: shape.stroke || "black",
              strokeWidth: shape.strokeWidth || 5,
              tension: 0.5,
              lineCap: "round",
              lineJoin: "round",
            });
            konvaLayer.add(line);
          } else if (shape.type === "text") {
            const text = new Konva.Text({
              x: shape.x,
              y: shape.y,
              text: shape.text || "",
              fontSize: shape.fontSize || 20,
              fill: shape.fill || "black",
            });
            konvaLayer.add(text);
          }
        });

        stage.add(konvaLayer);
      }
    });
    const dataURL = stage.toDataURL({ pixelRatio: 2 });
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "drawing.png";
    link.click();
    stage.destroy();
  };
  return (
    <div className='draw-btn-container'>
      <div className='toolbar-buttons'>
        <button
          onClick={() => dispatch(setTool("rectangle"))}
          className='draw-button'
          style={{
            border: selectedTool === "rectangle" ? "2px solid green" : "1px solid #ccc",
          }}
        >
          <span>
            <LuRectangleHorizontal />
          </span>
        </button>
        <button
          onClick={() => dispatch(setTool("circle"))}
          className='draw-button'
          style={{
            border: selectedTool === "circle" ? "2px solid green" : "1px solid #ccc",
          }}
        >
          <span>
            <FaRegCircle />
          </span>
        </button>
        <button
          onClick={() => dispatch(setTool("text"))}
          className='draw-button'
          style={{
            border: selectedTool === "text" ? "2px solid green" : "1px solid #ccc",
          }}
        >
          <span>
            <BsAlphabet />
            <LuTextCursor />
          </span>
        </button>
        <button
          onClick={() => dispatch(setTool("freehand"))}
          className='draw-button'
          style={{
            border: selectedTool === "freehand" ? "2px solid green" : "1px solid #ccc",
          }}
        >
          <span>
            <FaPenAlt />
          </span>
        </button>
        {selectedTool == "freehand" ? (
          <>
            <input type='range' min='1' max='10' value={strokeWidth} onChange={(e) => dispatch(setStrokeWidth(Number(e.target.value)))} />
          </>
        ) : (
          <></>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <input
            type='color'
            id='colorPicker'
            value={strokeColor}
            onChange={(e) => dispatch(setStrokeColor(e.target.value))}
            style={{
              width: "40px",
              height: "40px",
              cursor: "pointer",
              padding: "0",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <button onClick={() => dispatch(undo())} className='draw-button'>
          <span>
            <LuUndo2 />
          </span>
        </button>
        <button onClick={() => dispatch(redo())} className='draw-button'>
          <span>
            <LuRedo2 />
          </span>
        </button>
        <button
          onClick={() => {
            if (selectedShapeId) {
              dispatch(deleteShape({ id: selectedShapeId }));
            } else {
              alert("No shape selected. Please select a shape to delete.");
            }
          }}
          disabled={!selectedShapeId}
          className='draw-button'
        >
          <span>
            <MdDelete />
          </span>
        </button>
        <button onClick={handleDownload} className='draw-button'>
          <span>
            <FaDownload />
          </span>
        </button>
      </div>

      <div className='theme-toggle-wrapper' onClick={() => dispatch(toggleTheme())}>
        <FaSun className='theme-icon sun-icon' />
        <div className={`theme-toggle ${theme === "dark" ? "dark-mode" : "light-mode"}`}>
          <div className='toggle-circle'></div>
        </div>
        <FaMoon className='theme-icon moon-icon' />
      </div>
    </div>
  );
};

export default Toolbar;
