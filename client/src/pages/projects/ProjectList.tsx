import React, { useState, useEffect, lazy } from "react";
import "../../App.css";
import Button from "../../components/Button/Button";
import Modal from "../../components/Modal/Modal";
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
import { Button as MaterialButton, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import Pagination from "../../components/Pagination/Pagination";
import { error } from "node:console";
import "./services/project.service";
import {
  GetProjects,
  CreateProject,
  DeleteProject,
  UpdateProject,
  EditProject,
} from "./services/project.service";
import { useProject } from "./hooks/useProjects";

const ProjectList = () => {
  const { projects } = useProject();

  // const [projects, setProjects] = useState<Project[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [dataPerPage, setDataPerPage] = useState(0);

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

  const [currentPage, setCurrentPage] = useState(1);
  const page = searchParams.get("page") || 0;
  const perPage = searchParams.get("perPage") || "";
  const [isChangePage, setIsChangePage] = useState(false);

  const [formData, setFormData] = useState({
    name: projectToEdit?.name || "",
    status: projectToEdit?.status || "",
    priority: projectToEdit?.priority || "",
    assignee: projectToEdit?.assignee || "",
    created_At: projectToEdit?.created_At || "",
    updated_At: projectToEdit?.updated_At || "",
  });

  // Fetch projects when keyword in URL changes
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await GetProjects({
          keyword,
          orderBy,
        });

        setProjects(data.data);
        setTotalData(data.totalData);
        setDataPerPage(data.perPage);
      } catch (error) {
        setIsServerError(true);
      }
    };

    fetchProjects();
  }, [keyword, orderBy, projectOrderBy, location.pathname]);

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
      // id: Number(id),
      name,
      status,
      assignee,
      priority,
      created_At: new Date().toISOString(),
      updated_At: new Date().toISOString(),
    };

    try {
      await CreateProject(newProject); // call the API to create a new project
      setName("");
      setPriority("");
      setAssignee("");
      setStatus("");
      navigate("/projects");
    } catch (error) {
      toast.error("Error add new project");
    }
  };

  const handleDeleteClick = async (id?: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmed) return;

    try {
      await DeleteProject(id); // call the API to delete the project

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
      priority: formData.priority,
      assignee: formData.assignee,
      created_At: formData.created_At,
      updated_At: new Date().toISOString(),
    };

    try {
      await UpdateProject(Number(id), editProject); // call the API to update the project

      navigate("/projects");
    } catch (error) {
      toast.error("Error update project");
    }
  };

  const openEditModal = async (id?: Number) => {
    try {
      const data = await EditProject(Number(id)); // call the API to open edit modal for the project
      navigate(`/projects/${id}/edit`);

      setFormData({
        name: data.name,
        status: data.status,
        assignee: data.assignee,
        priority: data.priority,
        created_At: data.created_At,
        updated_At: data.updated_At,
      });
    } catch {
      setIsServerError(true);
    }
  };

  const OrderBy = async (column: String) => {
    try {
      if (isSorting) return;
      setIsSorting(true);

      if (column === "project") column = "name";
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

      const data = await GetProjects({ keyword, orderBy: newOrderBy }); // call the API to order the project based on column name

      setProjects(data.data);
      setIsSorting(false);
    } catch (error) {}
  };

  const OnPageChange = async (page: number) => {
    try {
      if (isChangePage) return;
      setIsChangePage(true);
      setCurrentPage(page);

      const params = Object.fromEntries(searchParams.entries());
      params.page = page.toString();
      params.perPage = dataPerPage.toString();

      setSearchParams(params);

      const data = await GetProjects({ page: page, perPage: dataPerPage });

      setProjects(data.data);

      setIsChangePage(false);
    } catch (error) {
      setIsServerError(true);
    }
  };

  const ChangePerPage = async (maxPerPage: number) => {
    try {
      setDataPerPage(maxPerPage);

      const params = Object.fromEntries(searchParams.entries());
      params.page = "1";
      params.perPage = maxPerPage.toString();

      setSearchParams(params);

      const data = await GetProjects({ page: 1, perPage: maxPerPage });

      setProjects(data.data);
    } catch (error) {
      setIsServerError(true);
    }
  };

  if (isServerError) {
    return <ServerError />;
  }

  return (
    // <div className="flex flex-col overflow-y-auto w-11/12 mt-5 mb-10 bg-white rounded-xl text-[#3F4355] shadow-md">
    <div className="flex flex-col max-h-[50rem] h-[90vh] my-auto w-[95%] bg-white rounded-xl text-[#3F4355] shadow-md">
      <div className="flex flex-col flex-none p-6">
        {/* Header */}
        <div className="flex justify-between mb-6">
          <h2 className="text-3xl font-semibold">Project List</h2>
          <Button
            text="Add New Project"
            background="bg-[#1464D0]"
            textColor="text-white"
            onClick={() => navigate("/projects/create")}
          />
        </div>

        {/* Search */}
        <div className="flex gap-3 items-center">
          <div className="relative w-full max-w-sm">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search Project..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={projectKeyword}
              onChange={(e) => setProjectKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApplyClick()}
            />
          </div>

          <Button
            text="Apply"
            background="bg-blue-600"
            textColor="text-white"
            onClick={handleApplyClick}
          />
          <Button
            text="Clear"
            background="bg-red-500"
            textColor="text-white"
            onClick={handleClearSearchClick}
          />
        </div>
      </div>

      {/* <div className="overflow-y-auto max-h-[600px] border rounded-lg"> */}
      <div className="flex grow items-start overflow-y-auto border rounded-lg">
        <table className="w-full text-center border-collapse">
          <thead className="sticky top-0 bg-gray-700 text-white z-10">
            <tr>
              {[
                "Name",
                "Priority",
                "Status",
                "Assignee",
                "Updated",
                "Action",
              ].map((header, i) => (
                <th
                  key={i}
                  className={`py-3 cursor-pointer text-m ${
                    isSorting ? "opacity-50 pointer-events-none" : ""
                  }`}
                  onClick={() =>
                    header !== "Action" &&
                    OrderBy(header.toLowerCase().replace(" ", "_"))
                  }
                >
                  {header}
                  {projectOrderBy.startsWith(
                    header.toLowerCase().replace(" ", "_")
                  ) && (
                    <FontAwesomeIcon
                      icon={isAsc ? faSortUp : faSortDown}
                      className="ml-1"
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <tr
                  key={project.id}
                  className={`border-b hover:bg-gray-100 text-s transition ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="py-3">{project.name}</td>
                  <td className="py-3">{project.priority}</td>
                  <td className="py-3">{project.status}</td>
                  <td className="py-3">{project.assignee}</td>
                  <td className="py-3">
                    {new Date(project.updated_At).toLocaleString()}
                  </td>

                  <td className="py-3 flex justify-center gap-4">
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="cursor-pointer hover:text-blue-500 transition"
                      onClick={() => openEditModal(project.id)}
                    />

                    <FontAwesomeIcon
                      icon={faTrash}
                      className="cursor-pointer text-red-500 hover:text-red-700 transition"
                      onClick={() => handleDeleteClick(project.id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-4 col-span-6 text-gray-500">
                  No data found for this keyword
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-none justify-between px-6 bg-amber-200">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalData / dataPerPage)}
          maxPerPage={dataPerPage}
          onPageChange={OnPageChange}
          items={projects}
        />

        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-500">
            ({(currentPage - 1) * dataPerPage + 1}–
            {Math.min(currentPage * dataPerPage, totalData)} / {totalData})
          </p>

          <div className="text-sm">
            Per Page:
            {[5, 10, 30].map((n) => (
              <button
                key={n}
                className="ml-2 text-blue-600 hover:underline"
                onClick={() => ChangePerPage(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`fixed backdrop-blur-xs inset-0 flex justify-center items-center z-50 ${
          isEditProjectShown || isAddNewProjectShown ? "" : "hidden"
        }`}
      >
        <div
          className={`bg-white p-6 rounded-2xl shadow-xl w-full max-w-md ${
            isEditProjectShown || isAddNewProjectShown ? "" : "hidden"
          }`}
        >
          <Modal
            isOpen={isEditProjectShown || isAddNewProjectShown}
            title={isEditProjectShown ? "Edit Project" : "Add New Project"}
            onClose={() => navigate("/projects")}
          >
            <form
              onSubmit={
                isEditProjectShown ? handleSubmitEdit : handleCreateProject
              }
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                name="name"
                placeholder="Project name..."
                className="border-2 border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-blue-400"
                value={isEditProjectShown ? formData.name : name}
                onChange={
                  isEditProjectShown
                    ? handleChange
                    : (e) => setName(e.target.value)
                }
              />

              <select
                name="priority"
                id="priority"
                className="border-2 border-gray-400 rounded-xl p-2"
                value={isEditProjectShown ? formData.priority : priority}
                onChange={
                  isEditProjectShown
                    ? handleChange
                    : (e) => setPriority(e.target.value)
                }
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
                value={isEditProjectShown ? formData.status : status}
                onChange={
                  isEditProjectShown
                    ? handleChange
                    : (e) => setStatus(e.target.value)
                }
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
                value={isEditProjectShown ? formData.assignee : assignee}
                onChange={
                  isEditProjectShown
                    ? handleChange
                    : (e) => setAssignee(e.target.value)
                }
              >
                <option value="" disabled>
                  Pick assignee...
                </option>
                <option value="Alif">Alif</option>
              </select>

              <button
                type="submit"
                className="bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
              >
                Submit
              </button>
            </form>
          </Modal>
        </div>
      </div>
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
