import React, { useState, useEffect } from 'react';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { Container, Typography } from '@mui/material';

export default function Home() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => setTasks(data.tasks));
  }, []);

  const addTask = (task) => {
    fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task }),
    })
    .then(res => res.json())
    .then(newTask => setTasks([...tasks, newTask]));
  };

  const deleteTask = (id) => {
    fetch(`/api/tasks?id=${id}`, {
      method: 'DELETE',
    })
    .then(res => res.json())
    .then(() => {
      setTasks(tasks.filter(task => task.id !== id));
    });
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Task Manager
      </Typography>
      <Typography variant="h6" gutterBottom>
        Stay organized and boost your <Typography component="span" style={{ fontWeight: 'bold' }}>productivity</Typography> with our Task Manager. Easily <Typography component="span" style={{ fontWeight: 'bold' }}>add</Typography>, <Typography component="span" style={{ fontWeight: 'bold' }}>view</Typography>, and <Typography component="span" style={{ fontWeight: 'bold' }}>delete</Typography> tasks, and ensure your tasks are free from <Typography component="span" style={{ fontWeight: 'bold' }}>negative sentiment</Typography> with our built-in sentiment analysis.
      </Typography>
      <TaskForm onAdd={addTask} />
      <TaskList tasks={tasks} onDelete={deleteTask} />
    </Container>
  );
}