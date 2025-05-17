import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const testAuthentication = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No token found in localStorage');
      return { success: false, message: 'No token found' };
    }
    
    const response = await axios.get(`${API_URL}/auth/test`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Auth test response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Auth test failed:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || error.message,
      status: error.response?.status
    };
  }
};

export const checkToken = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return { valid: false, message: 'No token found' };
  }
  
  try {
    // Base64 decode the JWT payload (middle part)
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    
    // Check if token is expired
    const expiryDate = new Date(decodedPayload.exp * 1000);
    const now = new Date();
    
    if (expiryDate < now) {
      return { valid: false, message: 'Token expired', payload: decodedPayload };
    }
    
    return { 
      valid: true, 
      payload: decodedPayload,
      expiresAt: expiryDate
    };
  } catch (error) {
    return { valid: false, message: 'Invalid token format', error };
  }
};
