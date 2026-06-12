/**
 * Root Saga — Forks all feature sagas
 */

import { all, fork } from 'redux-saga/effects';
import authSaga from '../sagas/authSaga';
import activitySaga from '../sagas/activitySaga';
import waterSaga from '../sagas/waterSaga';
import goalsSaga from '../sagas/goalsSaga';

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(activitySaga),
    fork(waterSaga),
    fork(goalsSaga),
  ]);
}
