/**
 * Activity API service
 */

import api from './api';
import { ENDPOINTS } from '../constants/api';

export const activityService = {
  getDailyActivity: (date) => {
    return api.get(ENDPOINTS.DAILY_ACTIVITY, { params: { date } });
  },

  getWeeklyActivity: (startDate) => {
    return api.get(ENDPOINTS.WEEKLY_ACTIVITY, { params: { startDate } });
  },

  getMonthlyActivity: (month, year) => {
    return api.get(ENDPOINTS.MONTHLY_ACTIVITY, { params: { month, year } });
  },

  getYearlyActivity: (year) => {
    return api.get(ENDPOINTS.YEARLY_ACTIVITY, { params: { year } });
  },

  logActivity: (data) => {
    return api.post(ENDPOINTS.LOG_ACTIVITY, data);
  },

  getActivitySummary: () => {
    return api.get(ENDPOINTS.ACTIVITY_SUMMARY);
  },
};

export const waterService = {
  logWater: (amount, type) => {
    return api.post(ENDPOINTS.LOG_WATER, { amount, type });
  },

  getDailyWater: (date) => {
    return api.get(ENDPOINTS.DAILY_WATER, { params: { date } });
  },

  getWeeklyWater: (startDate) => {
    return api.get(ENDPOINTS.WEEKLY_WATER, { params: { startDate } });
  },

  getMonthlyWater: (month, year) => {
    return api.get(ENDPOINTS.MONTHLY_WATER, { params: { month, year } });
  },

  updateGoal: (goal) => {
    return api.put(ENDPOINTS.WATER_GOAL, { goal });
  },

  getStreak: () => {
    return api.get(ENDPOINTS.WATER_STREAK);
  },
};

export const goalsService = {
  getGoals: () => {
    return api.get(ENDPOINTS.GOALS);
  },

  createGoal: (data) => {
    return api.post(ENDPOINTS.GOALS, data);
  },

  updateGoal: (id, data) => {
    return api.put(`${ENDPOINTS.GOALS}/${id}`, data);
  },

  deleteGoal: (id) => {
    return api.delete(`${ENDPOINTS.GOALS}/${id}`);
  },

  getGoalProgress: (id) => {
    return api.get(ENDPOINTS.GOAL_PROGRESS(id));
  },
};

export const profileService = {
  getProfile: () => {
    return api.get(ENDPOINTS.PROFILE);
  },

  updateProfile: (data) => {
    return api.put(ENDPOINTS.PROFILE, data);
  },

  getAchievements: () => {
    return api.get(ENDPOINTS.ACHIEVEMENTS);
  },

  deleteAccount: () => {
    return api.delete(ENDPOINTS.DELETE_ACCOUNT);
  },
};

export const settingsService = {
  getSettings: () => {
    return api.get(ENDPOINTS.SETTINGS);
  },

  updateSettings: (data) => {
    return api.put(ENDPOINTS.SETTINGS, data);
  },

  updateNotificationSettings: (data) => {
    return api.put(ENDPOINTS.NOTIFICATION_SETTINGS, data);
  },
};

export const notificationService = {
  registerDevice: (fcmToken, deviceType, appVersion) => {
    return api.post(ENDPOINTS.REGISTER_DEVICE, { fcmToken, deviceType, appVersion });
  },

  getHistory: (page = 1, limit = 20) => {
    return api.get(ENDPOINTS.NOTIFICATION_HISTORY, { params: { page, limit } });
  },
};
