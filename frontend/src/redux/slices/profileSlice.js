/**
 * Profile Redux Slice
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  achievements: {
    longestStreak: 0,
    totalSteps: 0,
    totalDistance: 0,
    totalActiveTime: 0,
    badges: [],
  },
  isLoading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    fetchProfileRequest: (state) => { state.isLoading = true; },
    fetchProfileSuccess: (state, action) => {
      state.isLoading = false;
      state.profile = action.payload;
    },
    fetchProfileFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    updateProfileRequest: (state) => { state.isLoading = true; },
    updateProfileSuccess: (state, action) => {
      state.isLoading = false;
      state.profile = { ...state.profile, ...action.payload };
    },
    updateProfileFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    fetchAchievementsRequest: (state) => { state.isLoading = true; },
    fetchAchievementsSuccess: (state, action) => {
      state.isLoading = false;
      state.achievements = action.payload;
    },
    fetchAchievementsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchProfileRequest, fetchProfileSuccess, fetchProfileFailure,
  updateProfileRequest, updateProfileSuccess, updateProfileFailure,
  fetchAchievementsRequest, fetchAchievementsSuccess, fetchAchievementsFailure,
} = profileSlice.actions;

export default profileSlice.reducer;
