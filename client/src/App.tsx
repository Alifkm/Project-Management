import "./App.css";
import NavButton from "./components/NavButton/NavButton";

function App() {
  return (
    <>
      <div className="container">
        <div className="nav-container">
          <NavButton text="Projects" />
          <NavButton text="Todo" />
          <NavButton text="Users" />
        </div>
      </div>
    </>
  );
}

export default App;
