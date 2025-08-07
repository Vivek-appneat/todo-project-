import { apiClient } from "../apiConfig";
import { PATH } from "../apiConst";
import "../interceptors"; // Import to activate interceptors

// Auth API
export const loginApi = async (username: string, password: string) => {
  return apiClient({
    url: PATH.auth.login,
    method: "POST",
    data: { username, password },
  });
};

// Todos API
export const getTodos = async () => {
  return apiClient({
    url: PATH.todos.todoList,
    method: "GET",
  });
};

export const addTodo = async (data: {
  title: string;
  description: string;
  status: "pending" | "completed";
  due_date: string | null;
}) => {
  return apiClient({
    url: PATH.todos.createTodo,
    method: "POST",
    data,
  });
};

export const updateTodo = async (id: number, data: {
  title?: string;
  description?: string;
  status?: "pending" | "completed";
  due_date?: string | null;
}) => {
  return apiClient({
    url: PATH.todos.updateTodo(id),
    method: "PATCH",
    data,
  });
};

export const deleteTodo = async (id: number) => {
  return apiClient({
    url: PATH.todos.deleteTodo(id),
    method: "DELETE",
  });
};

// export const toggleTodo = async (id: number, status: string) => {
//   return apiClient({
//     url: PATH.todos.toggleTodo(id),
//     method: "PATCH",
//     data: { status },
//   });
// };
