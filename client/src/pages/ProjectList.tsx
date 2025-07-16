import { useState } from "react"
import "../App.css";

const ProjectList = () => {
  return (
    <>
        <table className="table-auto">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Assignee</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>AFI Kenaikan MOC 2025</td>
              <td>In Progress</td>
              <td>High</td>
              <td>Alif</td>
              <td>16/07/2025 01.00 PM</td>
            </tr>
            <tr>
              <td>BRI Billing</td>
              <td>Closed</td>
              <td>Urgent</td>
              <td>Alif</td>
              <td>01/07/2025 05.00 PM</td>
            </tr>
            <tr>
              <td>AFI Endorsemen Easy Health 2025</td>
              <td>Testing</td>
              <td>Normal</td>
              <td>Alif</td>
              <td>05/07/2025 09.00 AM</td>
            </tr>
          </tbody>
        </table>
    </>
  );
}

export default ProjectList;