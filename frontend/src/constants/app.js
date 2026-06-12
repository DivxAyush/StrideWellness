/**
 * App-wide constants
 */

export const APP = {
  NAME: 'Stride Wellness',
  TAGLINE: 'Track Progress. Build Habits.',
  VERSION: '1.0.0',
};

export const DEFAULTS = {
  DAILY_STEP_GOAL: 10000,
  DAILY_WATER_GOAL: 4000, // ml
  WATER_QUICK_ADD: [250, 500, 1000], // ml
};

export const ONBOARDING_SLIDES = [
  {
    id: '1',
    title: 'Track Your Daily Activity',
    description: 'See when you\'re most active and how many steps you take throughout the day',
  },
  {
    id: '2',
    title: 'Reach Your Daily Goal',
    description: 'Set a goal and track how many steps remain to reach it',
  },
  {
    id: '3',
    title: 'Build a Healthy Habit',
    description: 'Staying active every day helps you feel more energized',
  },
];

export const ACTIVITY_TABS = ['Today', 'Week', 'Month', 'Year'];

export const GOAL_TYPES = {
  STEPS: 'steps',
  WATER: 'water',
  WEIGHT: 'weight',
};

export const AUTH_PROVIDERS = {
  EMAIL: 'email',
  GOOGLE: 'google',
  GUEST: 'guest',
};

export const NOTIFICATION_TYPES = {
  GOAL_REMINDER: 'goal_reminder',
  WATER_REMINDER: 'water_reminder',
  DAILY_SUMMARY: 'daily_summary',
  WEEKLY_SUMMARY: 'weekly_summary',
  ACHIEVEMENT: 'achievement',
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: '@stride/access_token',
  REFRESH_TOKEN: '@stride/refresh_token',
  USER: '@stride/user',
  ONBOARDING_COMPLETE: '@stride/onboarding_complete',
  GUEST_DATA: '@stride/guest_data',
  THEME: '@stride/theme',
  NOTIFICATION_SETTINGS: '@stride/notification_settings',
};
