export interface Project {
  name: string,
  assignee: string,
  priority: string,
  status: string,
  created_At: Date,
  updated_At: Date
}

export interface ProjectQuery {
  keyword?: string,
  orderBy?: String
}

export interface ProjectListResponse {
  data: Project[],
  totalData: number,
  perPage: number
}