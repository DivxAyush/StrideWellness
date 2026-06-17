/**
 * Goals Redux Slice
 */

import { createSlice } from '@reduxjs/toolkit';
import { goalsService } from '../../services/dataService';

const initialState = {
 goals: [],
 isLoading: false,
 error: null,
};

const goalsSlice = createSlice({
 name: 'goals',
 initialState,
 reducers: {
  _fetchGoalsRequest: (state) => { state.isLoading = true; state.error = null; },
  _fetchGoalsSuccess: (state, action) => {
   state.isLoading = false;
   state.goals = action.payload;
  },

  _fetchGoalsFailure: (state, action) => {
   state.isLoading = false;
   state.error = action.payload;
  },

  _createGoalRequest: (state) => { state.isLoading = true; },
  createGoalSuccess: (state, action) => {
   state.isLoading = false;
   state.goals.push(action.payload);
  },

  _createGoalFailure: (state, action) => {
   state.isLoading = false;
   state.error = action.payload;
  },

  _updateGoalRequest: (state) => { state.isLoading = true; },
  updateGoalSuccess: (state, action) => {
   state.isLoading = false;
   const index = state.goals.findIndex((g) => g._id === action.payload._id);
   if (index !== -1) state.goals[index] = action.payload;
  },
  _updateGoalFailure: (state, action) => {
   state.isLoading = false;
   state.error = action.payload;
  },

  _deleteGoalRequest: (state) => { state.isLoading = true; },
  _deleteGoalSuccess: (state, action) => {
   state.isLoading = false;
   state.goals = state.goals.filter((g) => g._id !== action.payload);
  },
  _deleteGoalFailure: (state, action) => {
   state.isLoading = false;
   state.error = action.payload;
  },
 },
});

const {
 _fetchGoalsRequest, _fetchGoalsSuccess, _fetchGoalsFailure,
 _createGoalRequest, _createGoalFailure,
 _updateGoalRequest, _updateGoalFailure,
 _deleteGoalRequest, _deleteGoalSuccess, _deleteGoalFailure,
} = goalsSlice.actions;

export const { createGoalSuccess, updateGoalSuccess } = goalsSlice.actions;

export default goalsSlice.reducer;

// --------------------------------------------------------------------------
// Thunks
// --------------------------------------------------------------------------

export const fetchGoalsRequest = () => async (dispatch) => {
  try {
    dispatch(_fetchGoalsRequest());
    const response = await goalsService.getGoals();
    dispatch(_fetchGoalsSuccess(response.data.data));
  } catch (error) {
    dispatch(_fetchGoalsFailure(error.message));
  }
};

export const createGoalRequest = (payload) => async (dispatch) => {
  try {
    dispatch(_createGoalRequest());
    const response = await goalsService.createGoal(payload);
    dispatch(createGoalSuccess(response.data.data));
  } catch (error) {
    dispatch(_createGoalFailure(error.message));
  }
};

export const updateGoalRequest = (payload) => async (dispatch) => {
  try {
    dispatch(_updateGoalRequest());
    const { id, ...data } = payload;
    const response = await goalsService.updateGoal(id, data);
    dispatch(updateGoalSuccess(response.data.data));
  } catch (error) {
    dispatch(_updateGoalFailure(error.message));
  }
};

export const deleteGoalRequest = (payload) => async (dispatch) => {
  try {
    dispatch(_deleteGoalRequest());
    await goalsService.deleteGoal(payload);
    dispatch(_deleteGoalSuccess(payload));
  } catch (error) {
    dispatch(_deleteGoalFailure(error.message));
  }
};
