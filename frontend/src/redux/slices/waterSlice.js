/**
 * Water Redux Slice
 */

import { createSlice } from '@reduxjs/toolkit';
import { waterService } from '../../services/dataService';

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
    _addWaterRequest: (state) => {
      state.isLoading = true;
    },
    _addWaterSuccess: (state, action) => {
      state.isLoading = false;
      state.currentIntake = action.payload.totalIntake || 0;
      state.logs = action.payload.logs || [];
      state.dailyGoal = action.payload.dailyGoal || 4000;
    },
    _addWaterFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    _fetchDailyWaterRequest: (state) => { state.isLoading = true; },
    _fetchDailyWaterSuccess: (state, action) => {
      state.isLoading = false;
      state.currentIntake = action.payload.totalIntake || 0;
      state.logs = action.payload.logs || [];
      state.dailyGoal = action.payload.dailyGoal || 4000;
    },
    _fetchDailyWaterFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    fetchWeeklyWaterSuccess: (state, action) => {
      state.weeklyData = action.payload;
    },

    fetchMonthlyWaterSuccess: (state, action) => {
      state.monthlyData = action.payload;
    },

    _fetchOverallWaterRequest: (state) => { state.isLoading = true; },
    _fetchOverallWaterSuccess: (state, action) => {
      state.isLoading = false;
      state.overallData = action.payload || [];
    },
    _fetchOverallWaterFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    fetchWaterStreakSuccess: (state, action) => {
      state.streak = action.payload;
    },

    _updateWaterGoalRequest: (state, action) => {
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

const {
  _addWaterRequest, _addWaterSuccess, _addWaterFailure,
  _fetchDailyWaterRequest, _fetchDailyWaterSuccess, _fetchDailyWaterFailure,
  _fetchOverallWaterRequest, _fetchOverallWaterSuccess, _fetchOverallWaterFailure,
  _updateWaterGoalRequest,
} = waterSlice.actions;

export const {
  fetchWeeklyWaterSuccess, fetchMonthlyWaterSuccess,
  fetchWaterStreakSuccess,
  updateWaterGoalSuccess,
  resetDailyWater,
} = waterSlice.actions;

export default waterSlice.reducer;

// --------------------------------------------------------------------------
// Thunks
// --------------------------------------------------------------------------

export const addWaterRequest = (payload) => async (dispatch) => {
  try {
    dispatch(_addWaterRequest());
    const { amount, type } = payload;
    const response = await waterService.logWater(amount, type);
    dispatch(_addWaterSuccess(response.data.data));
  } catch (error) {
    dispatch(_addWaterFailure(error.message));
  }
};

export const fetchDailyWaterRequest = (payload) => async (dispatch) => {
  try {
    dispatch(_fetchDailyWaterRequest());
    const response = await waterService.getDailyWater(payload);
    dispatch(_fetchDailyWaterSuccess(response.data.data));
  } catch (error) {
    dispatch(_fetchDailyWaterFailure(error.message));
  }
};

export const fetchOverallWaterRequest = () => async (dispatch) => {
  try {
    dispatch(_fetchOverallWaterRequest());
    const response = await waterService.getOverallWater();
    dispatch(_fetchOverallWaterSuccess(response.data.data));
  } catch (error) {
    dispatch(_fetchOverallWaterFailure(error.message));
  }
};

export const updateWaterGoalRequest = (payload) => async (dispatch) => {
  try {
    dispatch(_updateWaterGoalRequest(payload));
    await waterService.updateGoal(payload);
    dispatch(updateWaterGoalSuccess(payload));
  } catch (error) {
    console.error('Failed to update water goal:', error);
  }
};
