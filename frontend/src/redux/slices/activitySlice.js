/**
 * Activity Redux Slice
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Daily
  dailySteps: 0,
  goalSteps: 10000,
  calories: 0,
  distance: 0,
  activeTime: 0,
  intensity: 0,
  hourlyData: [],
  
  // Weekly
  weeklyData: [],
  weeklyAverage: 0,
  mostActiveDay: null,
  
  // Monthly & Yearly
  monthlyData: [],
  yearlyData: [],
  
  // Summary
  currentStreak: 0,
  goalCompletionRate: 0,
  
  // UI
  activeTab: 0,
  isLoading: false,
  error: null,
};

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    fetchDailyActivityRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchDailyActivitySuccess: (state, action) => {
      state.isLoading = false;
      state.dailySteps = action.payload.steps || 0;
      state.goalSteps = action.payload.goalSteps || 10000;
      state.calories = action.payload.calories || 0;
      state.distance = action.payload.distance || 0;
      state.activeTime = action.payload.activeTime || 0;
      state.intensity = action.payload.intensity || 0;
      state.hourlyData = action.payload.hourlyData || [];
    },
    fetchDailyActivityFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    fetchWeeklyActivityRequest: (state) => {
      state.isLoading = true;
    },
    fetchWeeklyActivitySuccess: (state, action) => {
      state.isLoading = false;
      state.weeklyData = action.payload.data || [];
      state.weeklyAverage = action.payload.average || 0;
      state.mostActiveDay = action.payload.mostActiveDay || null;
    },
    fetchWeeklyActivityFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    fetchMonthlyActivityRequest: (state) => { state.isLoading = true; },
    fetchMonthlyActivitySuccess: (state, action) => {
      state.isLoading = false;
      state.monthlyData = action.payload.data || [];
    },
    fetchMonthlyActivityFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    fetchYearlyActivityRequest: (state) => { state.isLoading = true; },
    fetchYearlyActivitySuccess: (state, action) => {
      state.isLoading = false;
      state.yearlyData = action.payload.data || [];
    },
    fetchYearlyActivityFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    fetchActivitySummarySuccess: (state, action) => {
      state.currentStreak = action.payload.currentStreak || 0;
      state.goalCompletionRate = action.payload.goalCompletionRate || 0;
    },

    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },

    // For local/mock data
    setDailyActivity: (state, action) => {
      Object.assign(state, action.payload);
    },
  },
});

export const {
  fetchDailyActivityRequest, fetchDailyActivitySuccess, fetchDailyActivityFailure,
  fetchWeeklyActivityRequest, fetchWeeklyActivitySuccess, fetchWeeklyActivityFailure,
  fetchMonthlyActivityRequest, fetchMonthlyActivitySuccess, fetchMonthlyActivityFailure,
  fetchYearlyActivityRequest, fetchYearlyActivitySuccess, fetchYearlyActivityFailure,
  fetchActivitySummarySuccess,
  setActiveTab, setDailyActivity,
} = activitySlice.actions;

export default activitySlice.reducer;
