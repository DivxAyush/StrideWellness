/**
 * Form validation helpers
 */

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!regex.test(email)) return 'Please enter a valid email';
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must contain a lowercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain a number';
  return null;
};

export const validateName = (name) => {
  if (!name) return 'Name is required';
  if (name.length < 2) return 'Name must be at least 2 characters';
  if (name.length > 50) return 'Name must be less than 50 characters';
  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return null;
};

export const validateGoalTarget = (value, type) => {
  const num = Number(value);
  if (!value) return 'Target is required';
  if (isNaN(num) || num <= 0) return 'Please enter a valid number';

  switch (type) {
    case 'steps':
      if (num < 100) return 'Minimum 100 steps';
      if (num > 100000) return 'Maximum 100,000 steps';
      break;
    case 'water':
      if (num < 500) return 'Minimum 500 ml';
      if (num > 10000) return 'Maximum 10,000 ml';
      break;
    case 'weight':
      if (num < 20) return 'Minimum 20 kg';
      if (num > 300) return 'Maximum 300 kg';
      break;
  }
  return null;
};

export const validateWaterAmount = (amount) => {
  const num = Number(amount);
  if (!amount) return 'Amount is required';
  if (isNaN(num) || num <= 0) return 'Please enter a valid amount';
  if (num > 5000) return 'Maximum 5000 ml per entry';
  return null;
};
