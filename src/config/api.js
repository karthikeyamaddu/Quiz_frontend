/**
 * API Configuration
 * Centralized API endpoint configuration
 */

const API_URL = import.meta.env.VITE_API_URL || 'https://quiz-app-cfhf.onrender.com';

export const API_ENDPOINTS = {
  UPLOAD: `${API_URL}/upload`,
  QUIZ: `${API_URL}/quiz`,
  SUBMIT: `${API_URL}/submit-result`,
  STATS: (quizId) => `${API_URL}/quiz-stats/${quizId}`,
};

/**
 * Create a fetch request with CORS configuration
 */
export const apiCall = async (url, options = {}) => {
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  // Only include credentials for same-origin requests (not when using CORS proxy)
  const isSameOrigin = url.includes(window.location.origin);
  if (isSameOrigin) {
    finalOptions.credentials = 'include';
  }

  // Remove Content-Type for FormData
  if (options.body instanceof FormData) {
    delete finalOptions.headers['Content-Type'];
  }

  try {
    const response = await fetch(url, finalOptions);

    if (!response.ok) {
      throw new Error(
        `API Error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Handle different types of errors
    if (error.message.includes('Failed to fetch')) {
      throw new Error(
        'Network error: Cannot reach the server. Please check your connection and ensure the backend is running.'
      );
    }
    throw error;
  }
};

export default API_URL;
