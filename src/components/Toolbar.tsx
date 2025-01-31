import React from "react";
import "./styles/toolbar.css";

import { useDispatch, useSelector } from "react-redux";
import { setTool, setStrokeColor, setStrokeWidth, undo, redo, deleteShape } from "../app/features/toolSlice";
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

const Toolbar: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedTool, strokeColor, strokeWidth, selectedShapeId, historyIndex, history } = useSelector((state: RootState) => state.tool);
  const handleDownload = () => {
    const stage = document.querySelector("canvas");
    if (stage) {
      const dataURL = stage.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "drawing.png";
      link.click();
    }
  };
  return (
    <div className='draw-btn-container'>
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

      <button onClick={() => dispatch(undo())} className='draw-button' disabled={historyIndex == 0}>
        <span>
          <LuUndo2 />
        </span>
      </button>
      <button onClick={() => dispatch(redo())} className='draw-button' disabled={historyIndex + 1 == history.length}>
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
  );
};

export default Toolbar;
