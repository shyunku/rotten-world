import World from "main/World";
import "./App.scss";

function App() {
  return (
    <div
      className="App"
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      <World />
    </div>
  );
}

export default App;
