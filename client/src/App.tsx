import { Children } from "react";
import "./App.css";
import NavButton from "./components/NavButton/NavButton";
import ProjectList from "./pages/ProjectList";
import { useState, useEffect } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="grid grid-cols-5 w-screen h-screen">
        <div className="bg-gray-50 flex flex-col">
          <NavButton 
            style={{
              backgroundColor: "red"
            }}
          >
            Project  
          </NavButton> 
          <NavButton 
            style={{
              backgroundColor: "blue"
            }} 
          >
            Todo
          </NavButton>
          <NavButton 
            style={{
              backgroundColor: "green"
            }}
          >
            User
          </NavButton>
        </div>
        <div className="col-span-4">
          <ProjectList />
        </div>
      </div>
    </>
  );
}

export default App;
