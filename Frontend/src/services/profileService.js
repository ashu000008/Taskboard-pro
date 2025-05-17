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

export const getUserProfile = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/users/me`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const getUserStats = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/users/me/stats`,
      getAuthConfig()
    );
    
    console.log('Received stats:', response.data);
    
    // Ensure we have all required fields with fallbacks
    const stats = response.data || {};
    
    return {
      tasksCompleted: parseInt(stats.tasksCompleted) || 0,
      totalTasks: parseInt(stats.totalTasks) || 0,
      projectsCount: parseInt(stats.projectsCount) || 0,
      teamMembersCount: parseInt(stats.teamMembersCount) || 0,
      progressPercentage: parseInt(stats.progressPercentage) || 0
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
};