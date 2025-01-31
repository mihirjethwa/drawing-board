import DrawingBoard from "./components/DrawingBoard";
import Toolbar from "./components/Toolbar";

const App = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Toolbar />
      <DrawingBoard />
    </div>
  );
};

export default App;
