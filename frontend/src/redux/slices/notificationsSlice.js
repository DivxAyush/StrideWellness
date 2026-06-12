/**
 * Notifications Redux Slice
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  unreadCount: 0,
  fcmToken: null,
  isLoading: false,
  error: null,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setFcmToken: (state, action) => {
      state.fcmToken = action.payload;
    },

    fetchNotificationsRequest: (state) => { state.isLoading = true; },
    fetchNotificationsSuccess: (state, action) => {
      state.isLoading = false;
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.read).length;
    },
    fetchNotificationsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.read) state.unreadCount += 1;
    },

    markAsRead: (state, action) => {
      const notification = state.notifications.find((n) => n._id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },

    registerDeviceRequest: (state) => {},
    registerDeviceSuccess: (state) => {},
    registerDeviceFailure: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setFcmToken,
  fetchNotificationsRequest, fetchNotificationsSuccess, fetchNotificationsFailure,
  addNotification, markAsRead,
  registerDeviceRequest, registerDeviceSuccess, registerDeviceFailure,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
