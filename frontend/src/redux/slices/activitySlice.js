/**
 * Activity Redux Slice
 */

import { createSlice } from '@reduxjs/toolkit';
import { activityService } from '../../services/dataService';

const initialState = {
  // Daily
  liveSteps: 0,
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
    _fetchDailyActivityRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    _fetchDailyActivitySuccess: (state, action) => {
      state.isLoading = false;
      state.dailySteps = action.payload.steps || 0;
      state.goalSteps = action.payload.goalSteps || 10000;
      state.calories = action.payload.calories || 0;
      state.distance = action.payload.distance || 0;
      state.activeTime = action.payload.activeTime || 0;
      state.intensity = action.payload.intensity || 0;
      if (action.payload.hourlyData && action.payload.hourlyData.length > 0) {
        state.hourlyData = action.payload.hourlyData;
      }
    },
    _fetchDailyActivityFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    _fetchWeeklyActivityRequest: (state) => {
      state.isLoading = true;
    },
    _fetchWeeklyActivitySuccess: (state, action) => {
      state.isLoading = false;
      state.weeklyData = action.payload.data || [];
      state.weeklyAverage = action.payload.average || 0;
      state.mostActiveDay = action.payload.mostActiveDay || null;
    },
    _fetchWeeklyActivityFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    _fetchMonthlyActivityRequest: (state) => { state.isLoading = true; },
    _fetchMonthlyActivitySuccess: (state, action) => {
      state.isLoading = false;
      state.monthlyData = action.payload.data || [];
    },
    _fetchMonthlyActivityFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    _fetchYearlyActivityRequest: (state) => { state.isLoading = true; },
    _fetchYearlyActivitySuccess: (state, action) => {
      state.isLoading = false;
      state.yearlyData = action.payload.data || [];
    },
    _fetchYearlyActivityFailure: (state, action) => {
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

    setDailyActivity: (state, action) => {
      Object.assign(state, action.payload);
    },

    updateLiveSteps: (state, action) => {
      state.liveSteps = action.payload;
    },
    updateHourlyData: (state, action) => {
      state.hourlyData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase('goals/updateGoalSuccess', (state, action) => {
      if (action.payload && action.payload.type === 'steps') {
        state.goalSteps = action.payload.target;
      }
    });
    builder.addCase('goals/createGoalSuccess', (state, action) => {
      if (action.payload && action.payload.type === 'steps') {
        state.goalSteps = action.payload.target;
      }
    });
  },
});

const {
  _fetchDailyActivityRequest, _fetchDailyActivitySuccess, _fetchDailyActivityFailure,
  _fetchWeeklyActivityRequest, _fetchWeeklyActivitySuccess, _fetchWeeklyActivityFailure,
  _fetchMonthlyActivityRequest, _fetchMonthlyActivitySuccess, _fetchMonthlyActivityFailure,
  _fetchYearlyActivityRequest, _fetchYearlyActivitySuccess, _fetchYearlyActivityFailure,
} = activitySlice.actions;

export const {
  fetchActivitySummarySuccess, setActiveTab, setDailyActivity, updateLiveSteps, updateHourlyData,
} = activitySlice.actions;

export default activitySlice.reducer;

// --------------------------------------------------------------------------
// Thunks
// --------------------------------------------------------------------------

export const fetchDailyActivityRequest = (payload) => async (dispatch) => {
  try {
    dispatch(_fetchDailyActivityRequest());
    const response = await activityService.getDailyActivity(payload);
    dispatch(_fetchDailyActivitySuccess(response.data.data));
  } catch (error) {
    dispatch(_fetchDailyActivityFailure(error.message));
  }
};

export const fetchWeeklyActivityRequest = (payload) => async (dispatch) => {
  try {
    dispatch(_fetchWeeklyActivityRequest());
    const response = await activityService.getWeeklyActivity(payload);
    dispatch(_fetchWeeklyActivitySuccess(response.data.data));
  } catch (error) {
    dispatch(_fetchWeeklyActivityFailure(error.message));
  }
};

export const fetchMonthlyActivityRequest = (payload) => async (dispatch) => {
  try {
    dispatch(_fetchMonthlyActivityRequest());
    const response = await activityService.getMonthlyActivity(payload?.month, payload?.year);
    dispatch(_fetchMonthlyActivitySuccess(response.data.data));
  } catch (error) {
    dispatch(_fetchMonthlyActivityFailure(error.message));
  }
};

export const fetchYearlyActivityRequest = (payload) => async (dispatch) => {
  try {
    dispatch(_fetchYearlyActivityRequest());
    const response = await activityService.getYearlyActivity(payload);
    dispatch(_fetchYearlyActivitySuccess(response.data.data));
  } catch (error) {
    dispatch(_fetchYearlyActivityFailure(error.message));
  }
};
