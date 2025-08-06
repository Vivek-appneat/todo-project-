"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { ToastContainer, toast } from "react-toastify";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

const Dashboard: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Load todos from localStorage
  useEffect(() => {
    try {
      const storedTodos = localStorage.getItem("todos");
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      }
    } catch (error) { // Error generated while created the todo
      setError("Failed to load TODOs.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Save todos to localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Add Todo
  const handleAdd = () => {
    if (!newTodo) {
    // if (newTodo.trim() === "") {
      toast.error("Title cannot be empty.");
      return;
    }

    const newItem: Todo = {
      id: Date.now(),
      title: newTodo,
      completed: false,
    };

    setTodos([newItem, ...todos]);
    setNewTodo("");
    toast.success("Todo added!");
  };

  // Delete Todo
  const handleDelete = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    toast.error("Todo deleted.");
  };

  // Toggle Status
  const handleToggle = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Start Edit
  const startEdit = (id: number, title: string) => {
    setEditId(id);
    setEditTitle(title);
  };

  // Submit Edit
  const handleUpdate = () => {
    if (editTitle.trim() === "") {
      toast.error("Title cannot be empty.");
      return;
    }

    setTodos(
      todos.map((todo) =>
        todo.id === editId ? { ...todo, title: editTitle } : todo
      )
    );
    setEditId(null);
    setEditTitle("");
    toast.success("Todo updated!");
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <ToastContainer position="top-right" />

      <h1 className="text-2xl font-bold mb-4 text-center">TODO List</h1>

      {/* Error */}
      {error && (
        <p className="text-red-600 text-center mb-2 font-semibold">{error}</p>
      )}

      {/* Loading */}
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <>
          {/* Add Todo */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              className="border p-2 flex-1 rounded"
              placeholder="New TODO"
              value={newTodo}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewTodo(e.target.value)
              }
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleAdd}
            >
              Add
            </button>
          </div>

          {/* TODO List */}
          <ul>
            {todos.length === 0 ? (
              <p className="text-center text-gray-500">No TODOs found.</p>
            ) : (
              todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex flex-col sm:flex-row justify-between items-center border-b py-2"
                >
                  <div className="flex items-center gap-2 w-full sm:w-auto mb-2 sm:mb-0">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggle(todo.id)}
                    />
                    {editId === todo.id ? (
                      <input
                        className="border p-1 rounded"
                        value={editTitle}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setEditTitle(e.target.value)
                        }
                      />
                    ) : (
                      <span
                        className={
                          todo.completed ? "line-through text-gray-500" : ""
                        }
                      >
                        {todo.title}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {editId === todo.id ? (
                      <button
                        className="text-green-600 hover:underline"
                        onClick={handleUpdate}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className="text-yellow-600 hover:underline"
                        onClick={() => startEdit(todo.id, todo.title)}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(todo.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default Dashboard;
