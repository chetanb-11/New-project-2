const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const setToken = (token) => {
  localStorage.setItem('focus_flow_token', token);
};

export const getToken = () => {
  return localStorage.getItem('focus_flow_token');
};

export const removeToken = () => {
  localStorage.removeItem('focus_flow_token');
};

export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  const data = await response.json();
  setToken(data.token);
  return data.user;
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  const data = await response.json();
  setToken(data.token);
  return data.user;
};
