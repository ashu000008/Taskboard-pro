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

export const createAutomation = async (automationData) => {
  try {
    const response = await axios.post(
      `${API_URL}/automations`,
      automationData,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error creating automation:', error);
    throw error;
  }
};

export const getProjectAutomations = async (projectId) => {
  try {
    const response = await axios.get(
      `${API_URL}/automations/project/${projectId}`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching automations:', error);
    throw error;
  }
};

export const updateAutomation = async (automationId, automationData) => {
  try {
    const response = await axios.put(
      `${API_URL}/automations/${automationId}`,
      automationData,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error updating automation:', error);
    throw error;
  }
};

export const deleteAutomation = async (automationId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/automations/${automationId}`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting automation:', error);
    throw error;
  }
};

export const getUserBadges = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/automations/badges`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching badges:', error);
    throw error;
  }
};

export const getUserNotifications = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/automations/notifications`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const markNotificationRead = async (notificationId) => {
  try {
    const response = await axios.patch(
      `${API_URL}/automations/notifications/${notificationId}/read`,
      {},
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};
