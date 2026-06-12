/**
 * Utility formatters
 */

export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return num.toLocaleString();
  }
  return String(num);
};

export const formatSteps = (steps) => {
  return steps.toLocaleString();
};

export const formatCalories = (cal) => {
  return Math.round(cal).toLocaleString();
};

export const formatDistance = (meters) => {
  if (meters >= 1000) {
    return (meters / 1000).toFixed(1);
  }
  return String(Math.round(meters));
};

export const formatDistanceUnit = (meters) => {
  return meters >= 1000 ? 'km' : 'm';
};

export const formatDuration = (minutes) => {
  if (minutes >= 60) {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
  }
  return `${Math.round(minutes)} min`;
};

export const formatWaterMl = (ml) => {
  if (ml >= 1000) {
    return (ml / 1000).toFixed(1) + ' L';
  }
  return ml + ' ml';
};

export const formatPercentage = (value, total) => {
  if (!total) return 0;
  return Math.round((value / total) * 100);
};

export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatTime = (date) => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const getDayOfWeek = (date = new Date()) => {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

export const getRelativeDay = (date = new Date()) => {
  const today = new Date();
  const d = new Date(date);
  const diffTime = today.setHours(0, 0, 0, 0) - d.setHours(0, 0, 0, 0);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return getDayOfWeek(new Date(date));
  return formatDate(date);
};
