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

export const createComment = async (commentData) => {
  try {
    const response = await axios.post(
      `${API_URL}/comments`,
      commentData,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

export const getTaskComments = async (taskId) => {
  try {
    const response = await axios.get(
      `${API_URL}/comments/task/${taskId}`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/comments/${commentId}`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};
