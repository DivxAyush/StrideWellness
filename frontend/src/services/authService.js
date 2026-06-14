/**
 * Auth API service
 */

import api from './api';
import { ENDPOINTS } from '../constants/api';

export const authService = {
  login: (email, password) => {
    return api.post(ENDPOINTS.LOGIN, { email, password });
  },

  register: (name, email, password) => {
    return api.post(ENDPOINTS.REGISTER, { name, email, password });
  },

  googleLogin: (token) => {
    return api.post('/auth/firebase-login', { token });
  },

  refreshToken: (refreshToken) => {
    return api.post(ENDPOINTS.REFRESH_TOKEN, { refreshToken });
  },

  forgotPassword: (email) => {
    return api.post(ENDPOINTS.FORGOT_PASSWORD, { email });
  },

  resetPassword: (token, password) => {
    return api.post(ENDPOINTS.RESET_PASSWORD, { token, password });
  },

  logout: () => {
    return api.post(ENDPOINTS.LOGOUT);
  },
};

export default authService;
