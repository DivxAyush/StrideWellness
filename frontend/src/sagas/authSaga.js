/**
 * Auth Saga — Handles all authentication side effects.
 */

import { call, put, takeLatest, select } from 'redux-saga/effects';
import { authService } from '../services/authService';
import { storageService } from '../services/storageService';
import {
  loginRequest, loginSuccess, loginFailure,
  registerRequest, registerSuccess, registerFailure,
  googleLoginRequest, googleLoginSuccess, googleLoginFailure,
  guestLoginRequest, guestLoginSuccess,
  restoreSessionRequest, restoreSessionSuccess, restoreSessionFailure,
  forgotPasswordRequest, forgotPasswordSuccess, forgotPasswordFailure,
  logoutRequest, logoutSuccess,
} from '../redux/slices/authSlice';

function* handleLogin(action) {
  try {
    const { email, password } = action.payload;
    const response = yield call(authService.login, email, password);
    const { user, accessToken, refreshToken } = response.data.data;

    yield call(storageService.setTokens, accessToken, refreshToken);
    yield call(storageService.setUser, user);

    yield put(loginSuccess({ user, accessToken, refreshToken }));
  } catch (error) {
    yield put(loginFailure(error.message || 'Login failed'));
  }
}

function* handleRegister(action) {
  try {
    const { name, email, password } = action.payload;
    const response = yield call(authService.register, name, email, password);
    const { user, accessToken, refreshToken } = response.data.data;

    yield call(storageService.setTokens, accessToken, refreshToken);
    yield call(storageService.setUser, user);

    yield put(registerSuccess({ user, accessToken, refreshToken }));
  } catch (error) {
    yield put(registerFailure(error.message || 'Registration failed'));
  }
}

function* handleGoogleLogin() {
  try {
    // Google Sign-In flow will be implemented with Firebase
    // For now, this is a placeholder for the Firebase Auth integration
    yield put(googleLoginFailure('Google Sign-In requires Firebase configuration'));
  } catch (error) {
    yield put(googleLoginFailure(error.message || 'Google login failed'));
  }
}

function* handleGuestLogin() {
  try {
    yield call(storageService.setGuestData, {
      createdAt: new Date().toISOString(),
      activities: [],
      waterLogs: [],
      goals: [],
    });
    yield put(guestLoginSuccess());
  } catch (error) {
    console.error('Guest login error:', error);
  }
}

function* handleRestoreSession() {
  try {
    const accessToken = yield call(storageService.getAccessToken);
    const user = yield call(storageService.getUser);

    if (accessToken && user) {
      const refreshToken = yield call(storageService.getRefreshToken);
      yield put(restoreSessionSuccess({
        user,
        accessToken,
        refreshToken,
        isGuest: false,
      }));
      return;
    }

    // Check for guest session
    const guestData = yield call(storageService.getGuestData);
    if (guestData) {
      yield put(restoreSessionSuccess({
        user: { name: 'Guest', email: '', avatar: null },
        accessToken: null,
        refreshToken: null,
        isGuest: true,
      }));
      return;
    }

    yield put(restoreSessionFailure());
  } catch (error) {
    yield put(restoreSessionFailure());
  }
}

function* handleForgotPassword(action) {
  try {
    const { email } = action.payload;
    yield call(authService.forgotPassword, email);
    yield put(forgotPasswordSuccess());
  } catch (error) {
    yield put(forgotPasswordFailure(error.message || 'Failed to send reset email'));
  }
}

function* handleLogout() {
  try {
    const isGuest = yield select((state) => state.auth.isGuest);
    
    if (!isGuest) {
      try {
        yield call(authService.logout);
      } catch (e) {
        // Silent fail — logout API call is best effort
      }
    }

    yield call(storageService.clearAll);
    yield put(logoutSuccess());
  } catch (error) {
    // Force logout even on error
    yield put(logoutSuccess());
  }
}

export default function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(registerRequest.type, handleRegister);
  yield takeLatest(googleLoginRequest.type, handleGoogleLogin);
  yield takeLatest(guestLoginRequest.type, handleGuestLogin);
  yield takeLatest(restoreSessionRequest.type, handleRestoreSession);
  yield takeLatest(forgotPasswordRequest.type, handleForgotPassword);
  yield takeLatest(logoutRequest.type, handleLogout);
}
