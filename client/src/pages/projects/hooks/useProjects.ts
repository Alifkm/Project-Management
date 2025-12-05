import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ProjectQuery,
  ProjectListResponse,
  Project,
} from "../types/project.types";
import { GetProjects } from "../services/project.service";

export const useProject = ({
  keyword,
  orderBy,
  page,
  perPage,
}: ProjectQuery) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [dataPerPage, setDataPerPage] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();

  const [isServerError, setIsServerError] = useState(false);

  const fetchProject = useCallback(async () => {
    try {
      const data = await GetProjects({ keyword, orderBy, page, perPage });

      setProjects(data.data);
      setTotalData(data.totalData);
      setDataPerPage(data.perPage);
    } catch (error) {
      setIsServerError(true);
    }
  }, [keyword, orderBy, page, perPage]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return {
    projects,
  };
};
