/**
 * Root Reducer
 */

import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import activityReducer from './slices/activitySlice';
import waterReducer from './slices/waterSlice';
import goalsReducer from './slices/goalsSlice';
import profileReducer from './slices/profileSlice';
import settingsReducer from './slices/settingsSlice';
import notificationsReducer from './slices/notificationsSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  activity: activityReducer,
  water: waterReducer,
  goals: goalsReducer,
  profile: profileReducer,
  settings: settingsReducer,
  notifications: notificationsReducer,
});

export default rootReducer;
