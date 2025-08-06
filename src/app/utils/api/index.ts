import axios from "../axios";

export const loginApi = async (username: string, password: string) => {
  return axios.post("/auth/login", { username, password });
};

// Todos API
export const AddTodos = async (data: {
  title: string;
  description: string;
  status: "pending" | "completed";
  due_date: string | null;
}) => axios.post("/todos", data);
