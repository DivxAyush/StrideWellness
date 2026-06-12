/**
 * Settings Redux Slice
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: {
    goalReminder: true,
    waterReminder: true,
    dailySummary: true,
    weeklySummary: true,
    achievements: true,
  },
  theme: 'dark',
  isLoading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    fetchSettingsRequest: (state) => { state.isLoading = true; },
    fetchSettingsSuccess: (state, action) => {
      state.isLoading = false;
      if (action.payload.notifications) state.notifications = action.payload.notifications;
      if (action.payload.theme) state.theme = action.payload.theme;
    },
    fetchSettingsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    updateNotificationSetting: (state, action) => {
      const { key, value } = action.payload;
      state.notifications[key] = value;
    },

    updateSettingsRequest: (state) => { state.isLoading = true; },
    updateSettingsSuccess: (state) => { state.isLoading = false; },
    updateSettingsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchSettingsRequest, fetchSettingsSuccess, fetchSettingsFailure,
  updateNotificationSetting,
  updateSettingsRequest, updateSettingsSuccess, updateSettingsFailure,
} = settingsSlice.actions;

export default settingsSlice.reducer;
