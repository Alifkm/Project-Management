import { useState, useEffect } from "react";
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
  const [isAddNewProjectShown, setAddNewProjectShown] = useState(false);

  useEffect(() => {
    fetch("https://localhost:7054/projects")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Server Error");
        }
        return res.json();
      })
      .then((data: Project[]) => {
        setProjects(data);
      })
      .catch((error) => {
        setIsServerError(true);
      });
  }, []);

  if (isServerError) {
    return <ServerError />;
  }

  return (
    <div className="w-11/12 h-11/12 my-auto bg-gray-500 rounded-xl">
      <div className="flex flex-col m-5">
        <div className="flex justify-between mb-5">
          <h2 className="text-4xl">Project List</h2>
          <Button
            text="Add New Project"
            background="bg-blue-400"
            onClick={() => setAddNewProjectShown(true)}
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
            />
          </div>
          <Button text="apply" background="bg-blue-400" />
          <Button text="clear" background="bg-red-500" />
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
          {projects.map((project) => (
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
                {/* <Button text="Update" />
                <Button text="Delete" /> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={isAddNewProjectShown} />
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
