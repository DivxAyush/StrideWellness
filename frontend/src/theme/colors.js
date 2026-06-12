/**
 * Stride Wellness — Color System
 * 
 * A calm dark palette with a progress-focused green accent.
 * Inspired by the Stride concept design.
 */

export const colors = {
  // Backgrounds
  background: '#0B0C10',
  secondaryBackground: '#1C1F26',
  cardBackground: '#242833',
  cardBackgroundLight: '#2A2F3D',
  
  // Accent Colors
  primary: '#4ADE80',
  primaryDark: '#22C55E',
  primaryLight: '#86EFAC',
  primaryMuted: 'rgba(74, 222, 128, 0.15)',
  primaryGlow: 'rgba(74, 222, 128, 0.25)',
  
  secondaryAccent: '#A0CAFF',
  secondaryAccentMuted: 'rgba(160, 202, 255, 0.15)',
  
  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A09DA7',
  textTertiary: '#6B6880',
  textInverse: '#0B0C10',
  
  // Status
  success: '#4ADE80',
  warning: '#FBBF24',
  warningMuted: 'rgba(251, 191, 36, 0.15)',
  error: '#EF4444',
  errorMuted: 'rgba(239, 68, 68, 0.15)',
  info: '#A0CAFF',
  
  // Borders & Dividers
  border: 'rgba(255, 255, 255, 0.08)',
  borderLight: 'rgba(255, 255, 255, 0.12)',
  divider: 'rgba(255, 255, 255, 0.05)',
  
  // Overlays
  overlay: 'rgba(11, 12, 16, 0.7)',
  overlayLight: 'rgba(11, 12, 16, 0.5)',
  glass: 'rgba(36, 40, 51, 0.6)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  
  // Gradients (defined as arrays for LinearGradient)
  gradientPrimary: ['#4ADE80', '#22C55E'],
  gradientCard: ['rgba(36, 40, 51, 0.8)', 'rgba(28, 31, 38, 0.6)'],
  gradientDark: ['#0B0C10', '#1C1F26'],
  gradientAccent: ['rgba(74, 222, 128, 0.2)', 'rgba(74, 222, 128, 0)'],
  gradientChartFill: ['rgba(74, 222, 128, 0.3)', 'rgba(74, 222, 128, 0.0)'],
  
  // Shadows
  shadowColor: '#000000',
  shadowPrimary: 'rgba(74, 222, 128, 0.3)',
  
  // Tab Bar
  tabBarBackground: '#141720',
  tabBarActive: '#4ADE80',
  tabBarInactive: '#6B6880',
  
  // Specific
  toggleTrack: '#3A3F4B',
  toggleTrackActive: '#4ADE80',
  inputBackground: '#1C1F26',
  shimmer: 'rgba(255, 255, 255, 0.05)',
};

export default colors;
