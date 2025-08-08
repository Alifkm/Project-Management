import React, { useState, useEffect } from "react";
import "../App.css";
import Button from "../components/Button/Button";
import Modal from "../components/Modal/Modal";
import { Server } from "node:tls";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faFileEdit,
  faRemove,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons/faDeleteLeft";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { useNavigate, useSearchParams, Route, useLocation } from "react-router-dom";

interface Project {
  id: number;
  name: string;
  status: string;
  priority: string;
  assignee: string;
  created_At: string;
  updated_At: string;
}

const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isServerError, setIsServerError] = useState(false);
  // const [isAddNewProjectShown, setAddNewProjectShown] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const [projectKeyword, setProjectKeyword] = useState(keyword);
  const location = useLocation();
  const navigate = useNavigate();
  const isAddNewProjectShown = location.pathname === "/projects/create";

  const [name, setName] = useState("");
  const [status, setStatus] = useState("new");
  const [priority, setPriority] = useState("");
  const [assignee, setAssignee] = useState("");


  // Fetch projects when keyword in URL changes
  useEffect(() => {
  const fetchProjects = async () => {
    try {
      const url = keyword
        ? `https://localhost:7054/projects?keyword=${keyword}`
        : `https://localhost:7054/projects`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Server error");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      setIsServerError(true);
    }
  };

  fetchProjects();
}, [keyword]);

  const handleApplyClick = () => {
    if (projectKeyword) {
      setSearchParams({ keyword: projectKeyword });
    } else {
      setSearchParams({});
    }
  };

  const handleClearSearchClick = () => {
    setSearchParams("");
    setProjectKeyword("");
  }

  const handleCreateProject = async () => {
    const newProject = {
      name,
      status,
      assignee,
      priority,
      created_At: new Date(),
      updated_At: new Date()
    }

    try {
      const response = await fetch("https:/localhost:7054/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      });

      if(!response.ok) throw new Error("Failed to create new project");

      
    } catch (error) {
      console.log(error);
    }
  }

  if (isServerError) {
    return <ServerError />;
  }

  return (
    <div className="relative w-11/12 h-11/12 my-auto bg-gray-500 rounded-xl">
      <div className="flex flex-col m-5">
        <div className="flex justify-between mb-5">
          <h2 className="text-4xl">Project List</h2>
          <Button
            text="Add New Project"
            background="bg-blue-400"
            onClick={() => {
              // setAddNewProjectShown(true)
              navigate("/projects/create")
            }}
          />
        </div>
        <div className="flex justify-start gap-x-2 py-4">
          <div className="relative w-full max-w-md">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search Project..."
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={projectKeyword}
              onChange={(e) => setProjectKeyword(e.target.value)}
              onKeyDown={(e) => {
                if(e.key === "Enter") {
                  handleApplyClick();
                }
              }}
            />
          </div>
          <Button
            text="apply"
            background="bg-blue-400"
            onClick={handleApplyClick}
          />
          <Button
            text="clear"
            background="bg-red-500"
            onClick={handleClearSearchClick}
          />
        </div>
      </div>

      <table className="table-auto w-full text-center mt-5">
        <thead className="bg-cyan-300 border-2">
          <tr>
            <th>Project Name</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Assignee</th>
            <th>Updated</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="bg-cyan-600 py-20">
          {projects.length > 0 ? projects.map((project) => (
            <tr key={project.id}>
              <td className="py-2">{project.name}</td>
              <td className="py-2">{project.priority}</td>
              <td className="py-2">{project.status}</td>
              <td className="py-2">{project.assignee}</td>
              <td className="py-2">
                {new Date(project.updated_At).toLocaleString()}
              </td>
              <td className="gap-x-5 py-2">
                <FontAwesomeIcon
                  icon={faEdit}
                  className="cursor-pointer hover:bg-gray-400 py-1 rounded-xs mx-1"
                />
                <FontAwesomeIcon
                  icon={faTrash}
                  className="cursor-pointer text-red-500 hover:bg-red-300 py-1 rounded-xs mx-1"
                />
              </td>
            </tr>
          ))
          :
          (
            <tr className="col-span-6">
              <td>There is no data found based on keyword</td>
            </tr>
          )
        }
        </tbody>
      </table>

      {isAddNewProjectShown && (
        <div className="absolute top-1/2 left-1/2 z-20 transform -translate-x-1/2 -translate-y-1/2 p-6 rounded-lg bg-transparent">
          <Modal
            isOpen={true}
            title="Add New Project"
            onClose={() => navigate("/projects")}
          >
            <form action="" method="POST" className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Project name..."
                className="border-2 border-gray-400 rounded-xl p-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <select 
                name="priority" 
                id="priority" 
                className="border-2 border-gray-400 rounded-xl p-2"
                value={priority}
                onChange={(e) => setName(e.target.value)}>
                  <option value="Urgent">Urgent</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              <select 
                name="status" 
                id="status" 
                className="border-2 border-gray-400 rounded-xl p-2"
                value={status}
                onChange={(e) => setName(e.target.value)}>
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              <select 
                name="assignee" 
                id="assignee" 
                className="border-2 border-gray-400 rounded-xl p-2"
                value={assignee}
                onChange={(e) => setName(e.target.value)}>
                  <option value="Alif">Alif</option>
                </select>
              <button type="submit" onSubmit={handleCreateProject} className="border-2 rounded-xl">submit</button>
            </form>
          </Modal>
        </div>
      )}
    </div>
  );
};

const ServerError = () => {
  return (
    <>
      <div className="flex justify-center items-center h-full p-10">
        <h2 className="text-red-600 text-xl">
          ❌ There is a problem in the server. Data cannot be shown.
        </h2>
      </div>
    </>
  );
};

export default ProjectList;

      {/* {isAddNewProjectShown && (
        <div className="absolute top-1/2 left-1/2 z-20 transform -translate-x-1/2 -translate-y-1/2 p-6 rounded-lg bg-transparent">
          <Modal isOpen={isAddNewProjectShown} title="Add New Project">
            <form action="" method="post" className="flex flex-col gap-4">
              <input type="text" placeholder="Project name..." className="border-2 border-gray-400 rounded-xl p-2"/>
              <select name="priority" id="priority" className="border-2 border-gray-400 rounded-xl p-2"></select>
              <select name="status" id="status" className="border-2 border-gray-400 rounded-xl p-2"></select>
              <select name="assignee" id="assignee" className="border-2 border-gray-400 rounded-xl p-2"></select>
            </form>
          </Modal>
        </div>
      )} */}
