import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token and session ID to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;

    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = `guest_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      localStorage.setItem('sessionId', sessionId);
    }
    config.headers['x-session-id'] = sessionId;
  }
  return config;
});

export default api;
