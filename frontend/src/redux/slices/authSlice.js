/**
 * Auth Redux Slice
 */

import { createSlice } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import { storageService } from '../../services/storageService';

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
    // Internal reducers (renamed with _ to avoid clashing with Thunks)
    _loginRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    _loginSuccess: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.isGuest = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;
    },
    _loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    _registerRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    _registerSuccess: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.isGuest = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;
    },
    _registerFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    _googleLoginRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    _googleLoginSuccess: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.isGuest = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;
    },
    _googleLoginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    _guestLoginRequest: (state) => {
      state.isLoading = true;
    },
    _guestLoginSuccess: (state) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.isGuest = true;
      state.user = { name: 'Guest', email: '', avatar: null };
      state.error = null;
    },

    _restoreSessionRequest: (state) => {
      state.isRestoringSession = true;
    },
    _restoreSessionSuccess: (state, action) => {
      state.isRestoringSession = false;
      state.isAuthenticated = true;
      state.isGuest = action.payload.isGuest || false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    _restoreSessionFailure: (state) => {
      state.isRestoringSession = false;
      state.isAuthenticated = false;
    },

    _forgotPasswordRequest: (state) => {
      state.isLoading = true;
      state.error = null;
      state.forgotPasswordSuccess = false;
    },
    _forgotPasswordSuccess: (state) => {
      state.isLoading = false;
      state.forgotPasswordSuccess = true;
    },
    _forgotPasswordFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    _logoutRequest: (state) => {
      state.isLoading = true;
    },
    _logoutSuccess: (state) => {
      return { ...initialState, isRestoringSession: false };
    },

    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

const {
  _loginRequest, _loginSuccess, _loginFailure,
  _registerRequest, _registerSuccess, _registerFailure,
  _googleLoginRequest, _googleLoginSuccess, _googleLoginFailure,
  _guestLoginRequest, _guestLoginSuccess,
  _restoreSessionRequest, _restoreSessionSuccess, _restoreSessionFailure,
  _forgotPasswordRequest, _forgotPasswordSuccess, _forgotPasswordFailure,
  _logoutRequest, _logoutSuccess
} = authSlice.actions;

export const { updateUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;

// --------------------------------------------------------------------------
// Thunks (Replaces Sagas)
// --------------------------------------------------------------------------

export const loginRequest = (payload) => async (dispatch) => {
  try {
    dispatch(_loginRequest());
    const response = await authService.login(payload.email, payload.password);
    const { user, accessToken, refreshToken } = response.data.data;
    await storageService.setTokens(accessToken, refreshToken);
    await storageService.setUser(user);
    dispatch(_loginSuccess({ user, accessToken, refreshToken }));
  } catch (error) {
    dispatch(_loginFailure(error.message || 'Login failed'));
  }
};

export const registerRequest = (payload) => async (dispatch) => {
  try {
    dispatch(_registerRequest());
    const response = await authService.register(payload.name, payload.email, payload.password);
    const { user, accessToken, refreshToken } = response.data.data;
    await storageService.setTokens(accessToken, refreshToken);
    await storageService.setUser(user);
    dispatch(_registerSuccess({ user, accessToken, refreshToken }));
  } catch (error) {
    dispatch(_registerFailure(error.message || 'Registration failed'));
  }
};

export const googleLoginRequest = (payload) => async (dispatch) => {
  try {
    dispatch(_googleLoginRequest());
    const { idToken } = payload;
    if (!idToken) {
      throw new Error('Google ID token is missing. Please configure Google Sign-In on the frontend UI.');
    }

    const { auth } = await import('../../config/firebase');
    const { GoogleAuthProvider, signInWithCredential } = await import('firebase/auth');
    
    const credential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(auth, credential);
    const firebaseIdToken = await userCredential.user.getIdToken();

    const response = await authService.googleLogin(firebaseIdToken);
    const { user, accessToken, refreshToken } = response.data.data;

    await storageService.setTokens(accessToken, refreshToken);
    await storageService.setUser(user);

    dispatch(_googleLoginSuccess({ user, accessToken, refreshToken }));
  } catch (error) {
    console.error('Google login error:', error);
    dispatch(_googleLoginFailure(error.message || 'Google login failed'));
  }
};

export const guestLoginRequest = () => async (dispatch) => {
  try {
    dispatch(_guestLoginRequest());
    await storageService.setGuestData({
      createdAt: new Date().toISOString(),
      activities: [],
      waterLogs: [],
      goals: [],
    });
    dispatch(_guestLoginSuccess());
  } catch (error) {
    console.error('Guest login error:', error);
  }
};

export const restoreSessionRequest = () => async (dispatch) => {
  try {
    dispatch(_restoreSessionRequest());
    const accessToken = await storageService.getAccessToken();
    const user = await storageService.getUser();

    if (accessToken && user) {
      const refreshToken = await storageService.getRefreshToken();
      dispatch(_restoreSessionSuccess({
        user,
        accessToken,
        refreshToken,
        isGuest: false,
      }));
      return;
    }

    const guestData = await storageService.getGuestData();
    if (guestData) {
      dispatch(_restoreSessionSuccess({
        user: { name: 'Guest', email: '', avatar: null },
        accessToken: null,
        refreshToken: null,
        isGuest: true,
      }));
      return;
    }

    dispatch(_restoreSessionFailure());
  } catch (error) {
    dispatch(_restoreSessionFailure());
  }
};

export const forgotPasswordRequest = (payload) => async (dispatch) => {
  try {
    dispatch(_forgotPasswordRequest());
    await authService.forgotPassword(payload.email);
    dispatch(_forgotPasswordSuccess());
  } catch (error) {
    dispatch(_forgotPasswordFailure(error.message || 'Failed to send reset email'));
  }
};

export const logoutRequest = () => async (dispatch, getState) => {
  try {
    dispatch(_logoutRequest());
    const isGuest = getState().auth.isGuest;
    
    if (!isGuest) {
      try {
        await authService.logout();
      } catch (e) {
        // Silent fail
      }
    }

    await storageService.clearAll();
    dispatch(_logoutSuccess());
  } catch (error) {
    dispatch(_logoutSuccess());
  }
};
