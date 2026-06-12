/**
 * Activity Saga
 */

import { call, put, takeLatest } from 'redux-saga/effects';
import { activityService } from '../services/dataService';
import {
  fetchDailyActivityRequest, fetchDailyActivitySuccess, fetchDailyActivityFailure,
  fetchWeeklyActivityRequest, fetchWeeklyActivitySuccess, fetchWeeklyActivityFailure,
  fetchMonthlyActivityRequest, fetchMonthlyActivitySuccess, fetchMonthlyActivityFailure,
  fetchYearlyActivityRequest, fetchYearlyActivitySuccess, fetchYearlyActivityFailure,
  fetchActivitySummarySuccess, syncActivityDataRequest, syncActivityDataSuccess, syncActivityDataFailure,
} from '../redux/slices/activitySlice';

function* handleFetchDailyActivity(action) {
  try {
    const response = yield call(activityService.getDailyActivity, action.payload);
    yield put(fetchDailyActivitySuccess(response.data.data));
  } catch (error) {
    yield put(fetchDailyActivityFailure(error.message));
  }
}

function* handleFetchWeeklyActivity(action) {
  try {
    const response = yield call(activityService.getWeeklyActivity, action.payload);
    yield put(fetchWeeklyActivitySuccess(response.data.data));
  } catch (error) {
    yield put(fetchWeeklyActivityFailure(error.message));
  }
}

function* handleFetchMonthlyActivity(action) {
  try {
    const response = yield call(activityService.getMonthlyActivity, action.payload?.month, action.payload?.year);
    yield put(fetchMonthlyActivitySuccess(response.data.data));
  } catch (error) {
    yield put(fetchMonthlyActivityFailure(error.message));
  }
}

function* handleFetchYearlyActivity(action) {
  try {
    const response = yield call(activityService.getYearlyActivity, action.payload);
    yield put(fetchYearlyActivitySuccess(response.data.data));
  } catch (error) {
    yield put(fetchYearlyActivityFailure(error.message));
  }
}

export default function* activitySaga() {
  yield takeLatest(fetchDailyActivityRequest.type, handleFetchDailyActivity);
  yield takeLatest(fetchWeeklyActivityRequest.type, handleFetchWeeklyActivity);
  yield takeLatest(fetchMonthlyActivityRequest.type, handleFetchMonthlyActivity);
  yield takeLatest(fetchYearlyActivityRequest.type, handleFetchYearlyActivity);
}
