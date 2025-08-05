import { Children } from "react";
import "./App.css";
import NavButton from "./components/NavButton/NavButton";
import ProjectList from "./pages/ProjectList";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="w-screen h-screen overflow-hidden m-0 p-0">
        <div className="grid grid-cols-5 h-full">
          <div className="bg-gray-50 flex flex-col">
            <NavButton
              style={{
                backgroundColor: "red",
              }}
            >
              Project
            </NavButton>
            <NavButton
              style={{
                backgroundColor: "blue",
              }}
            >
              Todo
            </NavButton>
            <NavButton
              style={{
                backgroundColor: "green",
              }}
            >
              User
            </NavButton>
          </div>
          <div className="col-span-4 bg-cyan-900 flex content-center justify-center">
            <Routes>
              <Route path="/" element={<ProjectList />} />
              <Route path="/projects" element={<ProjectList />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
