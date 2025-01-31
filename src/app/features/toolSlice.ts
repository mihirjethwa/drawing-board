import { createSlice } from "@reduxjs/toolkit";

type Shape =
  | {
      id: string;
      type: "rectangle";
      x: number;
      y: number;
      width: number;
      height: number;
      fill?: string;
      scaleX?: number;
      scaleY?: number;
    }
  | {
      id: string;
      type: "circle";
      x: number;
      y: number;
      radius: number;
      fill?: string;
      scaleX?: number;
      scaleY?: number;
    }
  | {
      id: string;
      type: "freehand";
      points: number[];
      stroke?: string;
      strokeWidth?: number;
      scaleX?: number;
      scaleY?: number;
    }
  | {
      id: string;
      type: "text";
      x: number;
      y: number;
      text: string; // The text content
      fontSize?: number; // Font size
      fill?: string; // Text color
      scaleX?: number;
      scaleY?: number;
    };

interface ToolState {
  selectedTool: "rectangle" | "circle" | "freehand" | "text";
  strokeColor?: string;
  strokeWidth?: number;
  shapes: Shape[];
  history: Shape[][];
  historyIndex: number;
  selectedShapeId: string | null;
}

const initialState: ToolState = {
  selectedTool: "rectangle",
  strokeColor: "#6602f2",
  strokeWidth: 5,
  shapes: [],
  history: [[]],
  historyIndex: 0,
  selectedShapeId: null,
};

const toolSlice = createSlice({
  name: "tool",
  initialState,
  reducers: {
    setTool: (state, action) => {
      state.selectedTool = action.payload;
    },
    setStrokeColor: (state, action) => {
      state.strokeColor = action.payload;
    },
    setStrokeWidth: (state, action) => {
      state.strokeWidth = action.payload;
    },
    addShape: (state, action) => {
      const newShapes = [...state.shapes, action.payload];
      state.shapes = newShapes;
      state.history = [...state.history.slice(0, state.historyIndex + 1), newShapes];
      state.historyIndex++;
    },
    updateShape: (state, action) => {
      const { id, updates } = action.payload;
      const updatedShapes = state.shapes.map((shape) => (shape.id === id ? { ...shape, ...updates } : shape));
      state.shapes = updatedShapes;

      state.history = [...state.history.slice(0, state.historyIndex + 1), updatedShapes];
      state.historyIndex++;
    },
    undo: (state) => {
      if (state.historyIndex > 0) {
        state.historyIndex--;
        state.shapes = state.history[state.historyIndex];
      }
    },
    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex++;
        state.shapes = state.history[state.historyIndex];
      }
    },
    selectShape: (state, action) => {
      state.selectedShapeId = action.payload;
    },
    deleteShape: (state, action) => {
      const { id } = action.payload;
      const updatedShapes = state.shapes.filter((shape) => shape.id !== id);
      state.shapes = updatedShapes;

      state.history = [...state.history.slice(0, state.historyIndex + 1), updatedShapes];
      state.historyIndex++;
    },
  },
});

export const { setTool, setStrokeColor, setStrokeWidth, addShape, updateShape, undo, redo, selectShape, deleteShape } = toolSlice.actions;
export default toolSlice.reducer;
