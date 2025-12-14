import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ProjectQuery,
  ProjectListResponse,
  Project,
} from "../types/project.types";
import { GetProjects } from "../services/project.service";

export const useProject = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [dataPerPage, setDataPerPage] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();

  const keyword = searchParams.get("keyword") || "";
  const page = searchParams.get("page") || 1;
  const perPage = searchParams.get("perPage") || "";
  const [projectKeyword, setProjectKeyword] = useState(keyword);

  const orderBy = searchParams.get("orderBy") || "";
  const [projectOrderBy, setProjectOrderBy] = useState(orderBy);
  const [isSorting, setIsSorting] = useState(false);
  const [isAsc, setIsAsc] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [isChangePage, setIsChangePage] = useState(false);

  const [isServerError, setIsServerError] = useState(false);

  const fetchProject = useCallback(async () => {
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
  }, [keyword, orderBy, location.pathname]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const handleSearchClick = () => {
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

  return {
    projects,
    projectKeyword,
    setProjectKeyword,
    handleSearchClick,
    handleClearSearchClick,
    projectOrderBy,
    OrderBy,
    isAsc,
    isSorting,
    currentPage,
    OnPageChange,
    ChangePerPage,
  };
};
