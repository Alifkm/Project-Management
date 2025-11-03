import React, { useState, useEffect, lazy } from "react";
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
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons/faDeleteLeft";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import {
  useNavigate,
  useSearchParams,
  Route,
  useLocation,
  useParams,
} from "react-router-dom";
import toast from "react-hot-toast";
import { faSortDown } from "@fortawesome/free-solid-svg-icons/faSortDown";
import { URL } from "node:url";
import { isatty } from "node:tty";

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
  const orderBy = searchParams.get("orderBy") || "";
  const [projectOrderBy, setProjectOrderBy] = useState(orderBy);
  const [isSorting, setIsSorting] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const isAddNewProjectShown = location.pathname === "/projects/create";
  const { id } = useParams();
  const isEditProjectShown = location.pathname.endsWith("/edit");

  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [assignee, setAssignee] = useState("");

  const projectToEdit = projects.find((p) => p.id === Number(id));

  const [isAsc, setIsAsc] = useState(true);

  const [formData, setFormData] = useState({
    name: projectToEdit?.name || "",
    status: projectToEdit?.status || "",
    priority: projectToEdit?.priority || "",
    assignee: projectToEdit?.assignee || "",
  });

  // Fetch projects when keyword in URL changes
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const query = new URLSearchParams();

        if (keyword) {
          query.append("keyword", keyword);
        }

        if (orderBy) {
          query.append("orderBy", orderBy);
        }

        const url = `https://localhost:7054/projects?${query.toString()}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Server error");
        const data = await response.json();
        setProjects(data);

        
      } catch (error) {
        setIsServerError(true);
      }
    };

    fetchProjects();
  }, [
    keyword, 
    orderBy,
    projectOrderBy, 
    location.pathname]);

  const handleApplyClick = () => {
    const params = Object.fromEntries(searchParams.entries());
    if (projectKeyword) {
      params.keyword = projectKeyword;
    } else {
      delete params.keyword;
    }
    setSearchParams(params);
  };

  const handleClearSearchClick = () => {
    const params = Object.fromEntries(searchParams.entries());
    delete params.keyword;
    setSearchParams(params);
    setProjectKeyword("");
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    const newProject = {
      name,
      status,
      assignee,
      priority,
      created_At: new Date(),
      updated_At: new Date(),
    };

    try {
      const response = await fetch("https://localhost:7054/projects/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      });

      if (!response.ok) throw new Error("Failed to create new project");

      toast.success("Success add new project");
      navigate("/projects");
    } catch (error) {
      toast.error("Error add new project");
    }
  };

  const handleDeleteClick = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `https://localhost:7054/projects/${id}/delete`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete project");
      toast.success("Project deleted successfully!");
      navigate("/projects");
    } catch (error) {
      toast.error("Error delete project");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    const editProject = {
      id: Number(id),
      name: formData.name,
      status: formData.status,
      assignee: formData.assignee,
      priority: formData.priority,
    };

    try {
      const response = await fetch(
        `https://localhost:7054/projects/${id}/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editProject),
        }
      );

      if (!response.ok) throw new Error("Failed to update project");

      toast.success("Success update project");
      navigate("/projects");
    } catch (error) {
      toast.error("Error update project");
    }
  };

  const openEditModal = async (id: Number) => {
    try {
      const url = `https://localhost:7054/projects/${id}/edit`;

      const response = await fetch(url);
      if (!response.ok)
        throw new Error("Server error while getting data by id");
      const data = await response.json();

      navigate(`/projects/${id}/edit`);
      setFormData({
        name: data.name,
        status: data.status,
        assignee: data.assignee,
        priority: data.priority,
      });
    } catch {
      setIsServerError(true);
    }
  };

  const OrderBy = async (column: String) => {
    try {
      if(isSorting) return;
      setIsSorting(true);

      let order = "asc";

      if (projectOrderBy.startsWith(column.toString())) {
        order = projectOrderBy.endsWith("asc") ? "desc" : "asc";
      }

      setIsAsc(!isAsc);
      order = isAsc ? "asc" : "desc";

      const newOrderBy = `${column.toString()}:${order}`;
 
      setProjectOrderBy(newOrderBy);

      const params = Object.fromEntries(searchParams.entries());

      params.orderBy = newOrderBy;
      setSearchParams(params);
      console.log(new URLSearchParams(params).toString());

      // const url = `https://localhost:7054/projects${location.search}`;
      const url = `https://localhost:7054/projects?${new URLSearchParams(params).toString()}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Server error");
      const data = await response.json();
      setProjects(data);
      setIsSorting(false);

    } catch (error) {
      setIsServerError(true);
    }
  };

  if (isServerError) {
    return <ServerError />;
  }

  return (
    <div className="relative w-11/12 h-11/12 my-auto bg-white rounded-xl text-[#3F4355]">
      <div className="flex flex-col m-5">
        <div className="flex justify-between mb-5">
          <h2 className="text-4xl">Project List</h2>
          <Button
            text="Add New Project"
            background="bg-[#1464D0]"
            textColor="text-white"
            onClick={() => {
              // setAddNewProjectShown(true)
              navigate("/projects/create");
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
                if (e.key === "Enter") {
                  handleApplyClick();
                }
              }}
            />
          </div>
          <Button
            text="apply"
            background="bg-[#1464D0]"
            textColor="text-white"
            onClick={handleApplyClick}
          />
          <Button
            text="clear"
            background="bg-red-500"
            textColor="text-white"
            onClick={handleClearSearchClick}
          />
        </div>
      </div>

      <table className="table-auto w-full text-center mt-5">
        <thead className="border-b-2">
          <tr>
            <th className={`cursor-pointer ${isSorting ? 'opacity-50 pointer-events-none' : ''}`} onClick={() => OrderBy("name")}>
              Project Name
              {projectOrderBy.startsWith("name") && (
                <FontAwesomeIcon icon={isAsc ? faSortUp : faSortDown} />
              )}
            </th>

            <th 
              className={`cursor-pointer ${isSorting ? 'opacity-50 pointer-events-none' : ''}`} 
              onClick={() => OrderBy("priority")}
            >
              Priority 
              {projectOrderBy.startsWith("priority") && (
                <FontAwesomeIcon icon={isAsc ? faSortUp : faSortDown} />
              )} 
            </th>

            <th 
              className={`cursor-pointer ${isSorting ? 'opacity-50 pointer-events-none' : ''}`} 
              onClick={() => OrderBy("status")}
            >
              Status
              {projectOrderBy.startsWith("status") && (
                <FontAwesomeIcon icon={isAsc ? faSortUp : faSortDown} />
              )} 
            </th>

            <th 
              className={`cursor-pointer ${isSorting ? 'opacity-50 pointer-events-none' : ''}`} 
              onClick={() => OrderBy("assignee")}
            >
              Assignee 
              {projectOrderBy.startsWith("assignee") && (
                <FontAwesomeIcon icon={isAsc ? faSortUp : faSortDown} />
              )}
            </th>

            <th 
              className={`cursor-pointer ${isSorting ? 'opacity-50 pointer-events-none' : ''}`} 
              onClick={() => OrderBy("updated_at")}
            >
              Updated 
              {projectOrderBy.startsWith("updated_at") && (
                <FontAwesomeIcon icon={isAsc ? faSortUp : faSortDown} />
              )}
            </th>

            <th>Action</th>
          </tr>
        </thead>
        <tbody className="py-20">
          {projects.length > 0 ? (
            projects.map((project) => (
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
                    // onClick={() => navigate(`/projects/${project.id}/edit`)}
                    onClick={() => openEditModal(project.id)}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="cursor-pointer text-red-500 hover:bg-red-300 py-1 rounded-xs mx-1"
                    onClick={() => handleDeleteClick(project.id)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr className="col-span-6">
              <td>There is no data found based on keyword</td>
            </tr>
          )}
        </tbody>
      </table>

      {isEditProjectShown && (
        <div
          className="absolute top-1/2 left-1/2 z-20 transform -translate-x-1/2 -translate-y-1/2 
                w-full max-w-md p-6 rounded-lg bg-white shadow-lg"
        >
          <Modal
            isOpen={true}
            title="Add New Project"
            onClose={() => navigate("/projects")}
          >
            <form
              action=""
              method="POST"
              className="flex flex-col gap-4"
              onSubmit={handleSubmitEdit}
            >
              <input
                type="text"
                name="name"
                placeholder="Project name..."
                className="border-2 border-gray-400 rounded-xl p-2"
                value={formData.name}
                onChange={handleChange}
              />
              <select
                name="priority"
                id="priority"
                className="border-2 border-gray-400 rounded-xl p-2"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Pick priority...
                </option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <select
                name="status"
                id="status"
                className="border-2 border-gray-400 rounded-xl p-2"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Pick status...
                </option>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <select
                name="assignee"
                id="assignee"
                className="border-2 border-gray-400 rounded-xl p-2"
                value={formData.assignee}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Pick assignee...
                </option>
                <option value="Alif">Alif</option>
                <option value="Devy">Devy</option>
              </select>
              <button
                type="submit"
                className="border-2 rounded-xl hover:cursor-pointer hover:bg-amber-200"
              >
                submit
              </button>
            </form>
          </Modal>
        </div>
      )}

      {isAddNewProjectShown && (
        <div
          className="absolute top-1/2 left-1/2 z-20 transform -translate-x-1/2 -translate-y-1/2 
                w-full max-w-md p-6 rounded-lg bg-white shadow-lg"
        >
          <Modal
            isOpen={true}
            title="Add New Project"
            onClose={() => navigate("/projects")}
          >
            <form
              action=""
              method="PUT"
              className="flex flex-col gap-4"
              onSubmit={handleCreateProject}
            >
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
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="" disabled>
                  Pick priority...
                </option>
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
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="" disabled>
                  Pick status...
                </option>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <select
                name="assignee"
                id="assignee"
                className="border-2 border-gray-400 rounded-xl p-2"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
              >
                <option value="" disabled>
                  Pick assignee...
                </option>
                <option value="Alif">Alif</option>
              </select>
              <button
                type="submit"
                className="border-2 rounded-xl hover:cursor-pointer hover:bg-amber-200"
              >
                submit
              </button>
            </form>
          </Modal>
        </div>
      )}

       {/* {!isDataLoaded && (
        <Loading />
      )} */}
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

