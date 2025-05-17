import React, { useState } from 'react';
import { Card, IconButton, CardContent, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { updateTask } from '../services/taskService';
import StatusEditPopup from './StatusEditPopup';

interface Task {
  _id: string;
  status: string;
  title: string;
  description: string;
}

interface TaskCardProps {
  task: Task;
  onUpdate: () => void;
  isAdmin?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, isAdmin = false }) => {
  const [statusPopupOpen, setStatusPopupOpen] = useState(false);

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await updateTask(task._id, { status: newStatus });
      onUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{task.title}</Typography>
        <Typography variant="body2" color="textSecondary">
          {task.description}
        </Typography>
      </CardContent>
      {!isAdmin && (
        <IconButton onClick={() => setStatusPopupOpen(true)}>
          <EditIcon />
        </IconButton>
      )}
      <StatusEditPopup
        open={statusPopupOpen}
        onClose={() => setStatusPopupOpen(false)}
        currentStatus={task.status}
        onStatusUpdate={handleStatusUpdate}
      />
    </Card>
  );
};

export default TaskCard;