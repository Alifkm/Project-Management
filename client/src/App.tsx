import { Children } from "react";
import "./App.css";
import NavButton from "./components/NavButton/NavButton";
import ProjectList from "./pages/ProjectList";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isModalAppeared, setModalAppeared] = useState(false);

  return (
    <>
      <div>
        <Toaster />
      </div>
      <div className="w-screen h-screen overflow-hidden m-0 p-0">
        <div className="grid grid-cols-5 h-full">
          <div className="bg-gray-50 flex flex-col">
            <h2 className="text-[#3F4355] text-xl font-bold mx-auto py-5">Project Management</h2>
            <NavButton
              style={{
                color: "black",
              }}
            >
              Project
            </NavButton>
            <NavButton
              style={{
                color: "black",
              }}
            >
              Todo
            </NavButton>
            <NavButton
              style={{
                color: "black",
              }}
            >
              User
            </NavButton>
          </div>
          <div className="col-span-4 bg-gray-200 flex content-center justify-center">
            <Routes>
              <Route path="/" element={<ProjectList />} />
              <Route path="/projects" element={<ProjectList />} />
              <Route path="/projects/create" element={<ProjectList />} />
              <Route path="/projects/:id/edit" element={<ProjectList />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
