/**
 * Redux Store Configuration
 */

import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'auth/loginRequest',
          'auth/registerRequest',
          'auth/googleLoginRequest',
        ],
      },
    }),
  devTools: __DEV__,
});

export default store;
