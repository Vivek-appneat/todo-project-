"use client";

import React, { useState, useEffect } from "react";
import { getTodos, addTodo, deleteTodo, updateTodo } from "../utils/api";
import { isAuthenticated, logout } from "../utils/auth";
import { useRouter } from "next/navigation";
import { AxiosResponse } from "axios";

type Todo = {
  id: number;
  title: string;
  description: string;
  status: "pending" | "completed";
  due_date: string | null;
};

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
    status: number;
  };
  request?: XMLHttpRequest;
  message: string;
};

const DashboardPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"pending" | "completed">("pending");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "success"
  );
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [fetching, setFetching] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState<"pending" | "completed">(
    "pending"
  );
  const [editDueDate, setEditDueDate] = useState("");
  console.log(editDueDate,editingId,todos,"editDueDate");
  

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      console.log("Not authenticated - redirecting to login");
      router.push("/");
      return;
    }
    fetchTodos();
  }, [router]);

  const fetchTodos = () => {
    setFetching(true);
    setMessage("");

    getTodos()
      .then((res) => {
        const response = res as AxiosResponse<Todo[]>;
        if (response?.data) {
          setTodos(response.data);
        } else {
          setTodos([]);
          setMessage("No todos found.");
          setMessageType("info");
        }
      })
      .catch((err: ApiError) => {
        console.error("Fetch error:", err);
        if (err.response) {
          setMessage(
            err.response.data?.message ||
              `Error ${err.response.status}: Failed to load todos`
          );
        } else if (err.request) {
          setMessage("Network error: Unable to connect to server");
        } else {
          setMessage("Failed to fetch todos");
        }
        setMessageType("error");
      })
      .finally(() => setFetching(false));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!title.trim()) {
      setMessage("Title is required");
      setMessageType("error");
      setLoading(false);
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      status,
      due_date: dueDate || null,
    };

    addTodo(payload)
      .then((res) => {
        const response = res as AxiosResponse<Todo>;
        if (response?.data) {
          setMessage("Todo created successfully!");
          setMessageType("success");
          setTitle("");
          setDescription("");
          setStatus("pending");
          setDueDate("");
          fetchTodos();
        } else {
          setMessage("Failed to create todo");
          setMessageType("error");
        }
      })
      .catch((err: ApiError) => {
        console.error("Add error:", err);
        if (err.response) {
          setMessage(
            err.response.data?.message ||
              `Error ${err.response.status}: Failed to create todo`
          );
        } else if (err.request) {
          setMessage("Network error: Unable to connect to server");
        } else {
          setMessage("Failed to create todo");
        }
        setMessageType("error");
      })
      .finally(() => setLoading(false));
  };
  const handleUpdate = (id: number) => {
    debugger
    setLoading(true);
    setMessage("");

    updateTodo(id, {
      title: editTitle.trim(),
      description: editDescription.trim(),
      status: editStatus,
      due_date: editDueDate || null,
    })
    
    .then(() => {
      setMessage("Todo updated successfully!");
      setMessageType("success");
      setEditingId(null);
      fetchTodos();
    })
    .catch((err: ApiError) => {
      console.error("Update error:", err);
      if (err.response) {
        setMessage(
          err.response.data?.message ||
              `Error ${err.response.status}: Failed to update todo`
          );
        } else if (err.request) {
          setMessage("Network error: Unable to connect to server");
        } else {
          setMessage("Failed to update todo");
        }
        setMessageType("error");
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this todo?")) return;

    deleteTodo(id)
      .then((res) => {
        const response = res as AxiosResponse<{ message: string }>;
        if (response.status === 200) {
          setMessage("Todo deleted successfully!");
          setMessageType("success");
          fetchTodos();
        } else {
          setMessage("Failed to delete todo");
          setMessageType("error");
        }
      })
      .catch((err: ApiError) => {
        console.error("Delete error:", err);
        if (err.response) {
          setMessage(
            err.response.data?.message ||
              `Error ${err.response.status}: Failed to delete todo`
          );
        } else if (err.request) {
          setMessage("Network error: Unable to connect to server");
        } else {
          setMessage("Failed to delete todo");
        }
        setMessageType("error");
      });
  };

  const clearMessage = () => setMessage("");

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Todo Management</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {message && (
        <div
          className={`mb-4 p-3 rounded text-center ${
            messageType === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : messageType === "error"
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-yellow-100 text-yellow-800 border border-yellow-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span>{message}</span>
            <button
              onClick={clearMessage}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Add Todo Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Add New Todo</h2>
        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter todo title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter todo description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "pending" | "completed")
                }
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input
                type="date"
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !title.trim()}
          >
            {loading ? "Creating..." : "Create Todo"}
          </button>
        </form>
      </div>

      {/* Todo List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Todo List</h2>

        {fetching ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading todos...</p>
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No todos found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="p-3 border font-medium">ID</th>
                  <th className="p-3 border font-medium">Title</th>
                  <th className="p-3 border font-medium">Description</th>
                  <th className="p-3 border font-medium">Status</th>
                  <th className="p-3 border font-medium">Due Date</th>
                  <th className="p-3 border font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {todos.map((todo) => (
                  <tr key={todo.id} className="hover:bg-gray-50 border-b">
                    <td className="p-3 border text-center">{todo.id}</td>

                    <td className="p-3 border font-medium">
                      {editingId === todo.id ? (
                        <input
                          className="w-full border px-2 py-1 rounded"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                        />
                      ) : (
                        todo.title
                      )}
                    </td>

                    <td className="p-3 border">
                      {editingId === todo.id ? (
                        <input
                          className="w-full border px-2 py-1 rounded"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                        />
                      ) : (
                        todo.description || "—"
                      )}
                    </td>

                    <td className="p-3 border text-center">
                      {editingId === todo.id ? (
                        <select
                          value={editStatus}
                          onChange={(e) =>
                            setEditStatus(
                              e.target.value as "pending" | "completed"
                            )
                          }
                          className="border px-2 py-1 rounded"
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                        </select>
                      ) : (
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            todo.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {todo.status}
                        </span>
                      )}
                    </td>
                    

                    <td className="p-3 border text-center">
                      {editingId === todo.id ? (
                        <input
                          type="date"
                          value={editDueDate}
                          onChange={(e) => setEditDueDate(e.target.value)}
                          className="border px-2 py-1 rounded"
                        />
                      ) : todo.due_date ? (
                        new Date(todo.due_date).toLocaleDateString()
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className="p-3 border text-center space-x-2">
                      {editingId === todo.id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(todo.id)}
                            className="text-green-600 hover:underline"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-gray-600 hover:underline"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              debugger
                              setEditingId(todo.id);
                              setEditTitle(todo.title);
                              setEditDescription(todo.description || "");
                              setEditStatus(todo.status);
                              setEditDueDate(todo.due_date ? new Date(todo.due_date).toISOString().split("T")[0] : "");
                            }}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(todo.id)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
