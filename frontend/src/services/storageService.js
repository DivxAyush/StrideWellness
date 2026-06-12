/**
 * Storage service — AsyncStorage wrapper.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/app';

export const storageService = {
  // Tokens
  getAccessToken: async () => {
    return AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  getRefreshToken: async () => {
    return AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  setTokens: async (accessToken, refreshToken) => {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.ACCESS_TOKEN, accessToken],
      [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
    ]);
  },

  // User
  getUser: async () => {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  setUser: async (user) => {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  // Onboarding
  isOnboardingComplete: async () => {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
    return value === 'true';
  },

  setOnboardingComplete: async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
  },

  // Guest Data
  getGuestData: async () => {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.GUEST_DATA);
    return data ? JSON.parse(data) : null;
  },

  setGuestData: async (data) => {
    await AsyncStorage.setItem(STORAGE_KEYS.GUEST_DATA, JSON.stringify(data));
  },

  // Notification Settings
  getNotificationSettings: async () => {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_SETTINGS);
    return data ? JSON.parse(data) : null;
  },

  setNotificationSettings: async (settings) => {
    await AsyncStorage.setItem(
      STORAGE_KEYS.NOTIFICATION_SETTINGS,
      JSON.stringify(settings)
    );
  },

  // Clear all
  clearAll: async () => {
    const keys = Object.values(STORAGE_KEYS);
    await AsyncStorage.multiRemove(keys);
  },

  // Clear auth only (keep onboarding, settings)
  clearAuth: async () => {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER,
    ]);
  },
};

export default storageService;
