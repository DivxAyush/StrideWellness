/**
 * API endpoint constants
 */

// Use local URL for development or Render URL for production
// export const BASE_URL = 'http://localhost:3000/api/v1';
export const BASE_URL = 'https://stridewellness.onrender.com/api/v1';

export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  GOOGLE_LOGIN: '/auth/google',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  LOGOUT: '/auth/logout',

  // Users
  PROFILE: '/users/profile',
  ACHIEVEMENTS: '/users/achievements',
  DELETE_ACCOUNT: '/users/account',

  // Activities
  DAILY_ACTIVITY: '/activity/daily',
  WEEKLY_ACTIVITY: '/activity/weekly',
  MONTHLY_ACTIVITY: '/activity/monthly',
  YEARLY_ACTIVITY: '/activity/overall', // Map yearly to overall for now
  LOG_ACTIVITY: '/activity/sync',
  ACTIVITY_SUMMARY: '/activity/summary',

  // Water
  LOG_WATER: '/water/log',
  DAILY_WATER: '/water/daily',
  WEEKLY_WATER: '/water/weekly',
  MONTHLY_WATER: '/water/monthly',
  WATER_GOAL: '/water/goal',
  WATER_STREAK: '/water/streak',

  // Goals
  GOALS: '/goals',
  GOAL_PROGRESS: (id) => `/goals/${id}/progress`,

  // Settings
  SETTINGS: '/settings',
  NOTIFICATION_SETTINGS: '/settings/notifications',

  // Notifications
  REGISTER_DEVICE: '/notifications/register-device',
  NOTIFICATION_HISTORY: '/notifications/history',
};

export default ENDPOINTS;
