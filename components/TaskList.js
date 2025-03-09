import React from 'react';
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


export default function TaskList({ tasks = [], onDelete, onEdit }) {
  return (
    <List>
      {tasks.map((task) => {
        console.log("Rendering task:", task);
        return (
          <ListItem key={task.id}>
            <ListItemText primary={task.task} secondary={`Category: ${task.category} | Priority: ${task.priority}`} />
            <IconButton edge="end" aria-label="edit" onClick={() => onEdit(task)}>
              <EditIcon />
            </IconButton>
            <IconButton edge="end" aria-label="delete" onClick={() => onDelete(task.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        );
      })}
    </List>
  );
}
