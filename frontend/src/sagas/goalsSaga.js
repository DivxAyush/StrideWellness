/**
 * Goals Saga
 */

import { call, put, takeLatest } from 'redux-saga/effects';
import { goalsService } from '../services/dataService';
import {
  fetchGoalsRequest, fetchGoalsSuccess, fetchGoalsFailure,
  createGoalRequest, createGoalSuccess, createGoalFailure,
  updateGoalRequest, updateGoalSuccess, updateGoalFailure,
  deleteGoalRequest, deleteGoalSuccess, deleteGoalFailure,
} from '../redux/slices/goalsSlice';

function* handleFetchGoals() {
  try {
    const response = yield call(goalsService.getGoals);
    yield put(fetchGoalsSuccess(response.data.data));
  } catch (error) {
    yield put(fetchGoalsFailure(error.message));
  }
}

function* handleCreateGoal(action) {
  try {
    const response = yield call(goalsService.createGoal, action.payload);
    yield put(createGoalSuccess(response.data.data));
  } catch (error) {
    yield put(createGoalFailure(error.message));
  }
}

function* handleUpdateGoal(action) {
  try {
    const { id, ...data } = action.payload;
    const response = yield call(goalsService.updateGoal, id, data);
    yield put(updateGoalSuccess(response.data.data));
  } catch (error) {
    yield put(updateGoalFailure(error.message));
  }
}

function* handleDeleteGoal(action) {
  try {
    yield call(goalsService.deleteGoal, action.payload);
    yield put(deleteGoalSuccess(action.payload));
  } catch (error) {
    yield put(deleteGoalFailure(error.message));
  }
}

export default function* goalsSaga() {
  yield takeLatest(fetchGoalsRequest.type, handleFetchGoals);
  yield takeLatest(createGoalRequest.type, handleCreateGoal);
  yield takeLatest(updateGoalRequest.type, handleUpdateGoal);
  yield takeLatest(deleteGoalRequest.type, handleDeleteGoal);
}
