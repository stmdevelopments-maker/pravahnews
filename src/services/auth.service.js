/**
 * Auth Service - Handles Login, Register, Forgot Password, Logout
 * Connects to Laravel API at /api/auth/*
 */
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';
const AUTH_BASE = `${API_BASE}/auth`;
const AUTH_USER_KEY = 'pravah_auth_user';
const AUTH_TOKEN_KEY = 'pravah_auth_token';

// ─── Axios instance with token ────────────────────────────────────────────────
const authAxios = axios.create({ baseURL: API_BASE });
authAxios.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Token helpers ────────────────────────────────────────────────────────────
export const getToken = () => localStorage.getItem(AUTH_TOKEN_KEY);
export const getUser  = () => {
  try { return JSON.parse(localStorage.getItem(AUTH_USER_KEY)); }
  catch { return null; }
};
export const isLoggedIn = () => !!getToken();

const saveSession = (token, user) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};

// ─── API Calls ────────────────────────────────────────────────────────────────
export const loginUser = async (email, password) => {
  try {
    const res = await axios.post(`${AUTH_BASE}/login`, { email, password });
    if (res.data?.success) {
      saveSession(res.data.data.token, res.data.data.user);
    }
    return res.data;
  } catch (err) {
    // Re-throw with clean error message from Laravel response
    const msg = err.response?.data?.message || err.message || 'Login failed. Please try again.';
    const error = new Error(msg);
    error.response = err.response;
    throw error;
  }
};

export const registerUser = async (formData) => {
  const res = await axios.post(`${AUTH_BASE}/register`, formData);
  return res.data;
};

export const forgotPassword = async (email) => {
  const res = await axios.post(`${AUTH_BASE}/forgot-password`, { email });
  return res.data;
};

export const logoutUser = async () => {
  try {
    await authAxios.post('/auth/logout');
  } catch (_) { /* silent fail */ }
  clearSession();
};
