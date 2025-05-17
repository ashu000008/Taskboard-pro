import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configure axios with token
const getAuthConfig = () => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    console.error('No auth token found');
    throw new Error('Authentication required');
  }
  
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
};

export const createTask = async (taskData) => {
  try {
    const response = await axios.post(
      `${API_URL}/tasks`,
      taskData,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const getProjectTasks = async (projectId) => {
  try {
    const response = await axios.get(
      `${API_URL}/tasks/project/${projectId}`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching project tasks:', error);
    throw error;
  }
};

export const getTaskById = async (taskId) => {
  try {
    const response = await axios.get(
      `${API_URL}/tasks/${taskId}`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching task details:', error);
    throw error;
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    const response = await axios.put(
      `${API_URL}/tasks/${taskId}`,
      taskData,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const updateTaskStatus = async (taskId, status) => {
  try {
    console.log(`Updating task ${taskId} status to: ${status}`);
    const response = await axios.patch(
      `${API_URL}/tasks/${taskId}/status`,
      { status },
      getAuthConfig()
    );
    console.log('Status update successful');
    return response.data;
  } catch (error) {
    console.error('Error updating task status:', error);
    if (error.response) {
      console.error('Server response:', error.response.data);
    }
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/tasks/${taskId}`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export const updateProjectStatuses = async (projectId, statuses) => {
  try {
    const response = await axios.put(
      `${API_URL}/tasks/project/${projectId}/statuses`,
      { statuses },
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error updating project statuses:', error);
    throw error;
  }
};

export const getUserAssignedTasks = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/tasks/user/assigned`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching assigned tasks:', error);
    throw error;
  }
};
