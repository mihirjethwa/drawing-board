import DrawingBoard from "./components/DrawingBoard";
import LayersPanel from "./components/LayersPanel";
import Toolbar from "./components/Toolbar";

const App = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Toolbar />
      <DrawingBoard />
      <LayersPanel />
    </div>
  );
};

export default App;
