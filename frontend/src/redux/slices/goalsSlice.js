/**
 * Goals Redux Slice
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
 goals: [],
 isLoading: false,
 error: null,
};

const goalsSlice = createSlice({
 name: 'goals',
 initialState,
 reducers: {
  fetchGoalsRequest: (state) => { state.isLoading = true; state.error = null; },
  fetchGoalsSuccess: (state, action) => {
   state.isLoading = false;
   state.goals = action.payload;
  },

  fetchGoalsFailure: (state, action) => {
   state.isLoading = false;
   state.error = action.payload;
  },

  createGoalRequest: (state) => { state.isLoading = true; },
  createGoalSuccess: (state, action) => {
   state.isLoading = false;
   state.goals.push(action.payload);
  },

  createGoalFailure: (state, action) => {
   state.isLoading = false;
   state.error = action.payload;
  },

  updateGoalRequest: (state) => { state.isLoading = true; },
  updateGoalSuccess: (state, action) => {
   state.isLoading = false;
   const index = state.goals.findIndex((g) => g._id === action.payload._id);
   if (index !== -1) state.goals[index] = action.payload;
  },
  updateGoalFailure: (state, action) => {
   state.isLoading = false;
   state.error = action.payload;
  },

  deleteGoalRequest: (state) => { state.isLoading = true; },
  deleteGoalSuccess: (state, action) => {
   state.isLoading = false;
   state.goals = state.goals.filter((g) => g._id !== action.payload);
  },
  deleteGoalFailure: (state, action) => {
   state.isLoading = false;
   state.error = action.payload;
  },
 },
});

export const {
 fetchGoalsRequest, fetchGoalsSuccess, fetchGoalsFailure,
 createGoalRequest, createGoalSuccess, createGoalFailure,
 updateGoalRequest, updateGoalSuccess, updateGoalFailure,
 deleteGoalRequest, deleteGoalSuccess, deleteGoalFailure,
} = goalsSlice.actions;

export default goalsSlice.reducer;
