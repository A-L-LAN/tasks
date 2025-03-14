import React, { useState, useEffect } from 'react';
import { TextField, Button, Snackbar, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import * as toxicity from '@tensorflow-models/toxicity';

const threshold = 0.9;

export default function TaskForm({ onAdd, onUpdate, editingTask, clearEditing }) {
  const [task, setTask] = useState('');
  const [category, setCategory] = useState('Work');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [model, setModel] = useState(null);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    toxicity.load(threshold).then(mod => {
      setModel(mod);
    });
  }, []);

  useEffect(() => {
    if (editingTask) {
      setTask(editingTask.task);
      setCategory(editingTask.category || 'Work');
      setPriority(editingTask.priority || 'Medium');
      setDueDate(editingTask.due_date || '');
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (model) {
      const predictions = await model.classify([task]);
      const toxic = predictions.some(pred => pred.results.some(res => res.match));
      if (toxic) {
        setError('Task contains negative sentiment. Please revise.');
        setSnackbarOpen(true);
        return;
      }
    }
    if (editingTask) {
      onUpdate(editingTask.id, task, category, priority, dueDate);
    } else {
      onAdd(task, category, priority, dueDate);
    }
    setTask('');
    setCategory('Work');
    setPriority('Medium');
    setDueDate('');
    setError('');
    clearEditing();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <TextField
          label="New Task"
          variant="outlined"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          error={Boolean(error)}
          helperText={error}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <MenuItem value="Work">Work</MenuItem>
            <MenuItem value="Personal">Personal</MenuItem>
            <MenuItem value="Urgent">Urgent</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Priority</InputLabel>
          <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Due Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary">
          {editingTask ? 'Update' : 'Add'}
        </Button>
      </form>
      <Snackbar 
        open={snackbarOpen}
        autoHideDuration={6000}
        message={error}
        onClose={() => setSnackbarOpen(false)}
      />
    </>
  );
}
