/**
 * Auth Redux Slice
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isGuest: false,
  isLoading: false,
  isRestoringSession: true,
  error: null,
  forgotPasswordSuccess: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login
    loginRequest: (state, action) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.isGuest = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Register
    registerRequest: (state, action) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.isGuest = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;
    },
    registerFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Google Login
    googleLoginRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    googleLoginSuccess: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.isGuest = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;
    },
    googleLoginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Guest Mode
    guestLoginRequest: (state) => {
      state.isLoading = true;
    },
    guestLoginSuccess: (state) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.isGuest = true;
      state.user = { name: 'Guest', email: '', avatar: null };
      state.error = null;
    },

    // Session Restore
    restoreSessionRequest: (state) => {
      state.isRestoringSession = true;
    },
    restoreSessionSuccess: (state, action) => {
      state.isRestoringSession = false;
      state.isAuthenticated = true;
      state.isGuest = action.payload.isGuest || false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    restoreSessionFailure: (state) => {
      state.isRestoringSession = false;
      state.isAuthenticated = false;
    },

    // Forgot Password
    forgotPasswordRequest: (state, action) => {
      state.isLoading = true;
      state.error = null;
      state.forgotPasswordSuccess = false;
    },
    forgotPasswordSuccess: (state) => {
      state.isLoading = false;
      state.forgotPasswordSuccess = true;
    },
    forgotPasswordFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Logout
    logoutRequest: (state) => {
      state.isLoading = true;
    },
    logoutSuccess: (state) => {
      return { ...initialState, isRestoringSession: false };
    },

    // Update Profile
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },

    // Clear Error
    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginRequest, loginSuccess, loginFailure,
  registerRequest, registerSuccess, registerFailure,
  googleLoginRequest, googleLoginSuccess, googleLoginFailure,
  guestLoginRequest, guestLoginSuccess,
  restoreSessionRequest, restoreSessionSuccess, restoreSessionFailure,
  forgotPasswordRequest, forgotPasswordSuccess, forgotPasswordFailure,
  logoutRequest, logoutSuccess,
  updateUser, clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
