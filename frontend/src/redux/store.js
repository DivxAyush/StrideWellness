/**
 * Redux Store Configuration
 */

import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: {
        ignoredActions: [
          'auth/loginRequest',
          'auth/registerRequest',
          'auth/googleLoginRequest',
        ],
      },
    }).concat(sagaMiddleware),
  devTools: __DEV__,
});

sagaMiddleware.run(rootSaga);

export default store;
