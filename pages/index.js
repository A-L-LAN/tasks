import React, { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import { Container, Typography, Button, CircularProgress } from "@mui/material";

export default function Home() {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(() => {
    return session ? { id: session.user.id || null, name: session.user.name || "Unknown" } : null;
  });


  useEffect(() => {
    if (session) {
      fetch("/api/tasks")
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched tasks:", data.tasks); // Debugging
          setTasks(data.tasks || []);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching tasks:", error);
          setTasks([]);
          setLoading(false);
        });
    }
  }, [session]);

    const addTask = (task, category, priority, due_date) => {
      const userId = currentUser?.id; // Assume currentUser is from state/context
      if (!session?.user?.id) {
        console.error("Error: userId is missing");
        return;
      }

      fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task, category, priority, due_date, userId: session.user.id }), // Use session.user.id directly
      })
        .then((res) => res.json())
        .then((newTask) => setTasks([...tasks, newTask]))
        .catch((error) => console.error("Error adding task:", error));
    };

  const updateTask = (id, task, category, priority, due_date) => {
    fetch("/api/tasks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, task, category, priority, due_date, userId: session.user.id }), // Ensure userId is included
    })
      .then((res) => res.json())
      .then(() => {
        setTasks(tasks.map((t) => (t.id === id ? { ...t, task, category, priority, due_date } : t)));
        setEditingTask(null);
      });
  };
  
  const deleteTask = (id) => {
    fetch(`/api/tasks?id=${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, userId: session.user.id }), // Ensure userId is included
    })
      .then((res) => res.json())
      .then(() => setTasks(tasks.filter((task) => task.id !== id)))
      .catch((error) => console.error("Error deleting task:", error));
  }; 

  if (status === "loading") {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Task Manager
      </Typography>
      <Typography variant="h6" gutterBottom>
        Stay organized and boost your <Typography component="span" style={{ fontWeight: 'bold' }}>productivity</Typography> with our Task Manager. Easily <Typography component="span" style={{ fontWeight: 'bold' }}>add</Typography>, <Typography component="span" style={{ fontWeight: 'bold' }}>view</Typography>, and <Typography component="span" style={{ fontWeight: 'bold' }}>delete</Typography> tasks, and ensure your tasks are free from <Typography component="span" style={{ fontWeight: 'bold' }}>negative sentiment</Typography> with our built-in sentiment analysis.
      </Typography>

      {session ? (
        <>
        <Typography variant="h6">
          Welcome, <strong>{session.user.name}</strong>!
        </Typography>
        <Button variant="contained" color="secondary" onClick={() => signOut()}>
          Logout
        </Button>
        <TaskForm onAdd={addTask} onUpdate={updateTask} editingTask={editingTask} clearEditing={() => setEditingTask(null)} />
        {loading ? <CircularProgress /> : <TaskList tasks={tasks} onDelete={deleteTask} onEdit={setEditingTask} />}
      </>
    ) : (
      <>
        <Typography variant="h6">Sign in to manage your tasks.</Typography>
        <Button variant="contained" color="primary" onClick={() => signIn()}>
          Login
        </Button>
        <Button variant="contained" color="secondary" href="/signup" style={{ marginLeft: "10px" }}>
          Sign Up
        </Button>
      </>
      )}
    </Container>
  );
}
