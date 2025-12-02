import toast from "react-hot-toast";
import { data, FormMethod } from "react-router-dom";
import {
  Project,
  ProjectQuery,
  ProjectListResponse,
} from "../types/project.types";

const BASE_URL = "https://localhost:7054/projects";

export const GetProjects = async (
  query: ProjectQuery
): Promise<ProjectListResponse | any> => {
  try {
    const qs = new URLSearchParams(query as any).toString();
    const response = await fetch(`${BASE_URL}?${qs}`);

    if (!response.ok) toast.error("Failed to load projects");

    return await response.json();
  } catch (error) {
    toast.error("Server Error");
  }
};

export const CreateProject = async (project: Project) => {
  return await Request("create", "POST", project);
};

export const EditProject = async (
  id: number
): Promise<ProjectListResponse | any> => {
  const data = await Request("edit", "GET", null, id);
  return data?.json();
};

export const UpdateProject = async (id: number, project: Project) => {
  return await Request("update", "PUT", project, id);
};

export const DeleteProject = async (id?: number) => {
  return await Request("delete", "DELETE", null, id);
};

const Request = async (
  endpoint: string,
  method: string,
  body?: any,
  id?: number
) => {
  try {
    let additionalQuery = `${id}/${endpoint}`;
    if (endpoint.toLowerCase() == "create") {
      additionalQuery = `${endpoint}`;
    }

    const response = await fetch(`${BASE_URL}/${additionalQuery}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      toast.error("Server error");
    }
    // console.log(response.json());
    return response;
  } catch (error) {
    toast.error("Server error");
  }
};
