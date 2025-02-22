import axios from 'axios';

const API_URL = 'http://192.168.1.95:3000/api';

export const register = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { name, email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Error desconocido';
  }
};

export const login = async (identifier, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { identifier, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Error desconocido';
  }
};
