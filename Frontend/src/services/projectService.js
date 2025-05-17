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

export const createProject = async (projectData) => {
  try {
    const response = await axios.post(
      `${API_URL}/projects`, 
      projectData, 
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const getUserProjects = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/projects`, 
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const getProjectById = async (projectId) => {
  try {
    const response = await axios.get(
      `${API_URL}/projects/${projectId}`, 
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching project details:', error);
    throw error;
  }
};

export const updateProject = async (projectId, projectData) => {
  try {
    const response = await axios.put(
      `${API_URL}/projects/${projectId}`, 
      projectData, 
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

export const inviteUserToProject = async (projectId, email) => {
  try {
    const response = await axios.post(
      `${API_URL}/projects/${projectId}/invite`, 
      { email }, 
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error inviting user:', error);
    throw error;
  }
};

export const removeUserFromProject = async (projectId, userId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/projects/${projectId}/members/${userId}`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error removing user from project:', error);
    throw error;
  }
};

export const deleteProject = async (projectId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/projects/${projectId}`, 
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};
