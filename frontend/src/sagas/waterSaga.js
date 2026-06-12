/**
 * Water Saga
 */

import { call, put, takeLatest } from 'redux-saga/effects';
import { waterService } from '../services/dataService';
import {
  addWaterRequest, addWaterSuccess, addWaterFailure,
  fetchDailyWaterRequest, fetchDailyWaterSuccess, fetchDailyWaterFailure,
  fetchWeeklyWaterSuccess, fetchMonthlyWaterSuccess,
  fetchWaterStreakSuccess,
  syncWaterDataRequest, syncWaterDataSuccess, syncWaterDataFailure,
  updateWaterGoalRequest, updateWaterGoalSuccess,
} from '../redux/slices/waterSlice';

function* handleAddWater(action) {
  try {
    const { amount, type } = action.payload;
    const response = yield call(waterService.logWater, amount, type);
    yield put(addWaterSuccess(response.data.data));
  } catch (error) {
    yield put(addWaterFailure(error.message));
  }
}

function* handleFetchDailyWater(action) {
  try {
    const response = yield call(waterService.getDailyWater, action.payload);
    yield put(fetchDailyWaterSuccess(response.data.data));
  } catch (error) {
    yield put(fetchDailyWaterFailure(error.message));
  }
}

function* handleUpdateWaterGoal(action) {
  try {
    yield call(waterService.updateGoal, action.payload);
    yield put(updateWaterGoalSuccess(action.payload));
  } catch (error) {
    console.error('Failed to update water goal:', error);
  }
}

export default function* waterSaga() {
  yield takeLatest(addWaterRequest.type, handleAddWater);
  yield takeLatest(fetchDailyWaterRequest.type, handleFetchDailyWater);
  yield takeLatest(updateWaterGoalRequest.type, handleUpdateWaterGoal);
}
