/**
 * Extracts query parameters from the URL
 * @returns {Object} Object containing query parameters
 */
export const getQueryParams = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const params = {};
  
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  
  return params;
};

/**
 * Checks if the URL contains a task parameter and returns it
 * @returns {string|null} Task ID or null if not present
 */
export const getTaskIdFromUrl = () => {
  const params = getQueryParams();
  return params.task || null;
};
