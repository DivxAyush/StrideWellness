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
  overallData: [],
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
      state.currentIntake = action.payload.totalIntake || 0;
      state.logs = action.payload.logs || [];
      state.dailyGoal = action.payload.dailyGoal || 4000;
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

    fetchOverallWaterRequest: (state) => { state.isLoading = true; },
    fetchOverallWaterSuccess: (state, action) => {
      state.isLoading = false;
      state.overallData = action.payload || [];
    },
    fetchOverallWaterFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
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
  extraReducers: (builder) => {
    // Listen for goal updates from the goals slice to keep the Water screen in sync
    builder.addCase('goals/updateGoalSuccess', (state, action) => {
      if (action.payload && action.payload.type === 'water') {
        state.dailyGoal = action.payload.target * 1000; // L to ml
      }
    });
    builder.addCase('goals/createGoalSuccess', (state, action) => {
      if (action.payload && action.payload.type === 'water') {
        state.dailyGoal = action.payload.target * 1000; // L to ml
      }
    });
  },
});

export const {
  addWaterRequest, addWaterSuccess, addWaterFailure,
  fetchDailyWaterRequest, fetchDailyWaterSuccess, fetchDailyWaterFailure,
  fetchWeeklyWaterSuccess, fetchMonthlyWaterSuccess,
  fetchOverallWaterRequest, fetchOverallWaterSuccess, fetchOverallWaterFailure,
  fetchWaterStreakSuccess,
  updateWaterGoalRequest, updateWaterGoalSuccess,
  resetDailyWater,
} = waterSlice.actions;

export default waterSlice.reducer;
