import { Children } from "react";
import "./App.css";
import NavButton from "./components/NavButton/NavButton";
import ProjectList from "./pages/ProjectList";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <Toaster />
      </div>
      <div className="w-screen h-screen overflow-hidden m-0 p-0">
        <div className="grid grid-cols-5 h-full">
          <div className="bg-gray-50 flex flex-col">
            <NavButton
              style={{
                backgroundColor: "gray",
                color: "black",
              }}
            >
              Project
            </NavButton>
            <NavButton
              style={{
                backgroundColor: "gray",
                color: "black",
              }}
            >
              Todo
            </NavButton>
            <NavButton
              style={{
                backgroundColor: "gray",
                color: "black",
              }}
            >
              User
            </NavButton>
          </div>
          <div className="col-span-4 bg-cyan-900 flex content-center justify-center">
            <Routes>
              <Route path="/" element={<ProjectList />} />
              <Route path="/projects" element={<ProjectList />} />
              <Route path="/projects/create" element={<ProjectList />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
