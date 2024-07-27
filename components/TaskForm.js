import React, { useState, useEffect } from 'react';
import { TextField, Button, Snackbar } from '@mui/material';
import * as toxicity from '@tensorflow-models/toxicity';

const threshold = 0.9;

export default function TaskForm({ onAdd }) {
  const [task, setTask] = useState('');
  const [model, setModel] = useState(null);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    // Load the toxicity model
    toxicity.load(threshold).then(mod => {
      console.log('Toxicity model loaded');
      setModel(mod);
    }).catch(err => {
      console.error('Failed to load the toxicity model', err);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (model) {
      try {
        // Analyze the sentiment of the task
        const predictions = await model.classify([task]);
        console.log('Predictions:', predictions);
        const toxic = predictions.some(prediction => prediction.results.some(res => res.match));

        if (toxic) {
          setError('Task contains negative sentiment. Please revise.');
          setSnackbarOpen(true);
          return;
        }
      } catch (err) {
        console.error('Failed to classify the task', err);
        setError('Error classifying the task. Please try again.');
        setSnackbarOpen(true);
        return;
      }
    }
    // If not toxic, add the task
    onAdd(task);
    setTask('');
    setError('');
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
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
        />
        <Button type="submit" variant="contained" color="primary">
          Add
        </Button>
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={error}
      />
    </>
  );
}
