import "./App.css";
import Intro from "./sections/intro.jsx";
import Menu from "./sections/menu.jsx";

function App() {
  return (
    <>
      <Menu />
      <div className="w-2/3 m-auto">
        <Intro />
      </div>
    </>
  );
}

export default App;
