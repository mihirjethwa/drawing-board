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
      text: string;
      fontSize?: number;
      fill?: string;
      scaleX?: number;
      scaleY?: number;
    };

interface Layer {
  id: string;
  name: string;
  isVisible: boolean;
  shapes: Shape[];
  history: Shape[][];
  historyIndex: number;
}
interface ToolState {
  selectedTool: "rectangle" | "circle" | "freehand" | "text";
  strokeColor?: string;
  strokeWidth?: number;
  selectedShapeId: string | null;
  theme: string;
  layers: Layer[];
  activeLayerId: string | null;
}

const initialState: ToolState = {
  selectedTool: "rectangle",
  strokeColor: "#6602f2",
  strokeWidth: 5,
  selectedShapeId: null,
  theme: localStorage.getItem("theme") || "light",
  layers: [
    {
      id: "layer-1",
      name: "Layer 1",
      isVisible: true,
      shapes: [],
      history: [[]],
      historyIndex: 0,
    },
  ],
  activeLayerId: "layer-1",
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
      const activeLayer = state.layers.find((layer) => layer.id === state.activeLayerId);
      if (activeLayer) {
        const newShapes = [...activeLayer.shapes, action.payload];
        activeLayer.shapes = newShapes;

        activeLayer.history = [...activeLayer.history.slice(0, activeLayer.historyIndex + 1), newShapes];
        activeLayer.historyIndex++;
      }
    },
    updateShape: (state, action) => {
      const activeLayer = state.layers.find((layer) => layer.id === state.activeLayerId);
      if (activeLayer) {
        const { id, updates } = action.payload;
        const updatedShapes = activeLayer.shapes.map((shape) => (shape.id === id ? { ...shape, ...updates } : shape));
        activeLayer.shapes = updatedShapes;

        activeLayer.history = [...activeLayer.history.slice(0, activeLayer.historyIndex + 1), updatedShapes];
        activeLayer.historyIndex++;
      }
    },
    undo: (state) => {
      const activeLayer = state.layers.find((layer) => layer.id === state.activeLayerId);
      if (activeLayer && activeLayer.historyIndex > 0) {
        activeLayer.historyIndex--;
        activeLayer.shapes = activeLayer.history[activeLayer.historyIndex];
      }
    },
    redo: (state) => {
      const activeLayer = state.layers.find((layer) => layer.id === state.activeLayerId);
      if (activeLayer && activeLayer.historyIndex < activeLayer.history.length - 1) {
        activeLayer.historyIndex++;
        activeLayer.shapes = activeLayer.history[activeLayer.historyIndex];
      }
    },
    selectShape: (state, action) => {
      state.selectedShapeId = action.payload;
    },
    deleteShape: (state, action) => {
      const activeLayer = state.layers.find((layer) => layer.id === state.activeLayerId);
      if (activeLayer) {
        const { id } = action.payload;
        const updatedShapes = activeLayer.shapes.filter((shape) => shape.id !== id);
        activeLayer.shapes = updatedShapes;

        activeLayer.history = [...activeLayer.history.slice(0, activeLayer.historyIndex + 1), updatedShapes];
        activeLayer.historyIndex++;
      }
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.theme);
    },
    addLayer: (state) => {
      const newLayer = {
        id: `layer-${Date.now()}`,
        name: `Layer ${state.layers.length + 1}`,
        isVisible: true,
        shapes: [],
        history: [[]],
        historyIndex: 0,
      };
      state.layers.push(newLayer);
      state.activeLayerId = newLayer.id;
    },
    deleteLayer: (state, action) => {
      const layerId = action.payload;
      if (state.layers.length > 1) {
        state.layers = state.layers.filter((layer) => layer.id !== layerId);
        state.activeLayerId = state.layers[0].id;
      }
    },

    toggleLayerVisibility: (state, action) => {
      const layerId = action.payload;
      const layer = state.layers.find((layer) => layer.id === layerId);
      if (layer) {
        layer.isVisible = !layer.isVisible;
      }
    },

    setActiveLayer: (state, action) => {
      state.activeLayerId = action.payload;
    },
  },
});

export const { setTool, setStrokeColor, setStrokeWidth, addShape, updateShape, undo, redo, selectShape, deleteShape, toggleTheme, addLayer, deleteLayer, toggleLayerVisibility, setActiveLayer } = toolSlice.actions;
export default toolSlice.reducer;
