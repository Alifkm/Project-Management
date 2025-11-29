// export interface Project {
//   name: string;
//   assignee: string;
//   priority: string;
//   status: string;
//   created_At: Date;
//   updated_At: Date;
// }

export interface Project {
  id: number;
  name: string;
  assignee: string;
  priority: string;
  status: string;
  created_At: string;
  updated_At: string;
}

export interface ProjectQuery {
  keyword?: string;
  orderBy?: String;
  page?: number;
  perPage?: number;
}

export interface ProjectListResponse {
  data: Project[];
  totalData: number;
  perPage: number;
}
