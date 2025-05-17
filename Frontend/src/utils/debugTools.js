/**
 * Check authentication token status
 * @returns {Object} Token information
 */
export const checkAuthToken = () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return {
        valid: false,
        message: 'No token found in localStorage'
      };
    }

    // Try to parse token parts
    const parts = token.split('.');
    if (parts.length !== 3) {
      return {
        valid: false,
        message: 'Token is not in valid JWT format'
      };
    }

    // Decode payload
    const payload = JSON.parse(atob(parts[1]));
    const expiry = new Date(payload.exp * 1000);
    const now = new Date();

    return {
      valid: expiry > now,
      message: expiry > now ? 'Token is valid' : 'Token is expired',
      expiry: expiry.toLocaleString(),
      timeRemaining: Math.floor((expiry - now) / 1000 / 60) + ' minutes',
      payload
    };
  } catch (error) {
    return {
      valid: false,
      message: 'Error parsing token',
      error: error.message
    };
  }
};

/**
 * Add debug tools to the page
 */
export const initDebugMode = () => {
  // Only in development
  if (import.meta.env.DEV) {
    window.debugTools = {
      checkToken: checkAuthToken,
      clearToken: () => {
        localStorage.removeItem('authToken');
        console.log('Auth token cleared');
      },
      showToken: () => {
        console.log('Current token:', localStorage.getItem('authToken'));
      }
    };
    
    console.log('Debug tools initialized. Access via window.debugTools');
  }
};
