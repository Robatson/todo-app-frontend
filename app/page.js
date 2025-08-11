"use client";

import { useState, useEffect } from "react";

const API_URL = "https://todo-app-backend-go.onrender.com";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch(`${API_URL}/todo`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setTodos(data || []);
    } catch (err) {
      console.error(err);
      setTodos([]);
    }
  };

  const addTodo = async () => {
    if (!title.trim()) return; // Don't add empty todos
    try {
      const res = await fetch(`${API_URL}/todo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, completed: false }),
      });
      if (!res.ok) throw new Error("Failed to add todo");
      setTitle("");
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComplete = async (todo) => {
    try {
      const res = await fetch(`${API_URL}/todo?id=${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...todo, completed: !todo.completed }),
      });
      if (!res.ok) throw new Error("Failed to update todo");
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const res = await fetch(`${API_URL}/todo?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete todo");
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Todo List</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add new todo"
      />
      <button onClick={addTodo}>Add</button>

      <ul>
        {todos && todos.length > 0 ? (
          todos.map((todo) => (
            <li key={todo.id} style={{ marginBottom: 10 }}>
              <span
                onClick={() => toggleComplete(todo)}
                style={{
                  cursor: "pointer",
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
              >
                {todo.title} {todo.completed ? "(Done)" : "(Pending)"}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                style={{ marginLeft: 10 }}
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p>No todos found.</p>
        )}
      </ul>
    </div>
  );
}
