/**
 * Water Redux Slice
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dailyGoal: 4000, // ml
  currentIntake: 0,
  logs: [],
  weeklyData: [],
  monthlyData: [],
  streak: 0,
  isLoading: false,
  error: null,
};

const waterSlice = createSlice({
  name: 'water',
  initialState,
  reducers: {
    addWaterRequest: (state, action) => {
      state.isLoading = true;
    },
    addWaterSuccess: (state, action) => {
      state.isLoading = false;
      state.currentIntake += action.payload.amount;
      state.logs.unshift(action.payload);
    },
    addWaterFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    fetchDailyWaterRequest: (state) => { state.isLoading = true; },
    fetchDailyWaterSuccess: (state, action) => {
      state.isLoading = false;
      state.currentIntake = action.payload.totalIntake || 0;
      state.logs = action.payload.logs || [];
      state.dailyGoal = action.payload.dailyGoal || 4000;
    },
    fetchDailyWaterFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    fetchWeeklyWaterSuccess: (state, action) => {
      state.weeklyData = action.payload;
    },

    fetchMonthlyWaterSuccess: (state, action) => {
      state.monthlyData = action.payload;
    },

    fetchWaterStreakSuccess: (state, action) => {
      state.streak = action.payload;
    },

    updateWaterGoalRequest: (state, action) => {
      state.dailyGoal = action.payload;
    },
    updateWaterGoalSuccess: (state, action) => {
      state.dailyGoal = action.payload;
    },

    resetDailyWater: (state) => {
      state.currentIntake = 0;
      state.logs = [];
    },
  },
});

export const {
  addWaterRequest, addWaterSuccess, addWaterFailure,
  fetchDailyWaterRequest, fetchDailyWaterSuccess, fetchDailyWaterFailure,
  fetchWeeklyWaterSuccess, fetchMonthlyWaterSuccess,
  fetchWaterStreakSuccess,
  updateWaterGoalRequest, updateWaterGoalSuccess,
  resetDailyWater,
} = waterSlice.actions;

export default waterSlice.reducer;
