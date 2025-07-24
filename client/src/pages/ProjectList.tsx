import { useState, useEffect } from "react"
import "../App.css";

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

  useEffect(() => {
    fetch("https://localhost:7054/projects")
      .then((res) => res.json())
      .then((data: Project[]) => {
        setProjects(data);
        console.log(data);
      });
  }, []);

  return (
    <table className="table-auto w-full">
      <thead>
        <tr>
          <th>Project Name</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Assignee</th>
          <th>Updated</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project) => (
          <tr key={project.id}>
            <td>{project.name}</td>
            <td>{project.priority}</td>
            <td>{project.status}</td>
            <td>{project.assignee}</td>
            <td>{new Date(project.updated_At).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProjectList;