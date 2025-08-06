"use client";
import React, { useState, useEffect } from "react";

type Todo = {
  id: number;
  title: string;
  description: string;
  status: "pending" | "completed";
  due_date: string | null;
};
const DashboardPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"pending" | "completed">("pending");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [fetching, setFetching] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchTodos = async () => {
    setFetching(true);
    try {
      const res = await fetch("http://192.168.1.15:3000/todos/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error("❌ Error fetching todos:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!token) {
      setMessage("No token found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://192.168.1.15:3000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          status,
          due_date: dueDate || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to add todo");

      setMessage("✅ Todo added successfully!");
      setTitle("");
      setDescription("");
      setStatus("pending");
      setDueDate("");
      fetchTodos(); // Refresh list
    } catch (error) {
      setMessage("Failed to add todo.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this todo?")) return;

    try {
      const res = await fetch(`http://192.168.1.15:3000/todos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete todo");

      setMessage("🗑️ Todo deleted successfully!");
      fetchTodos();
    } catch (err) {
      setMessage("Failed to delete todo.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Add Todo</h1>

      {message && (
        <div className="mb-4 text-center text-blue-600">{message}</div>
      )}

      <form onSubmit={handleAdd} className="flex flex-col gap-4 mb-8">
        <input
          className="border p-2 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="border p-2 rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value as "pending" | "completed")}
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <input
          type="date"
          className="border p-2 rounded"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Todo"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2 text-center">Todo List</h2>

      {fetching ? (
        <p className="text-center">🔄 Loading todos...</p>
      ) : todos.length === 0 ? (
        <p className="text-center text-gray-500">No todos found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Due Date</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {todos.map((todo) => (
                <tr key={todo.id} className="hover:bg-gray-50">
                  <td className="p-2 border text-center">{todo.id}</td>
                  <td className="p-2 border">{todo.title}</td>
                  <td className="p-2 border">{todo.description}</td>
                  <td className="p-2 border text-center capitalize">
                    {todo.status}
                  </td>
                  <td className="p-2 border text-center">
                    {todo.due_date
                      ? new Date(todo.due_date).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
