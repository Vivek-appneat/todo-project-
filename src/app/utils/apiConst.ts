// api path base url
export const Base_URL = "http://192.168.1.13:3000";
export const API_ENDPOINT = `${Base_URL}`;

// api path
export const PATH = {
  auth: {
    login: `${API_ENDPOINT}/auth/login`,
    // profile: `${API_ENDPOINT}/auth/profile`,
  },
  todos: {
    todoList: `${API_ENDPOINT}/todos/all`,
    createTodo: `${API_ENDPOINT}/todos`,
    deleteTodo: (id: string | number) => `${API_ENDPOINT}/todos/${id}`,
    updateTodo: (id: string | number) => `${API_ENDPOINT}/todos/${id}`,
    // showTodo: (id: string | number) => `${API_ENDPOINT}/todos/${id}`,
    // toggleTodo: (id: string | number) => `${API_ENDPOINT}/todos/${id}/toggle`,
  },
};
