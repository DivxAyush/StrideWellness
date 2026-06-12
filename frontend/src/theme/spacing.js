/**
 * Stride Wellness — Spacing System
 * 
 * 8px grid system for consistent, balanced layouts.
 */

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
  massive: 64,
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 999,
};

export const iconSizes = {
  xs: 14,
  sm: 18,
  md: 22,
  lg: 28,
  xl: 36,
  xxl: 48,
};

export const hitSlop = {
  top: 10,
  bottom: 10,
  left: 10,
  right: 10,
};

// Screen layout helpers
export const layout = {
  screenPaddingH: spacing.lg,
  screenPaddingV: spacing.base,
  cardPadding: spacing.base,
  cardGap: spacing.md,
  sectionGap: spacing.xl,
  tabBarHeight: 80,
  headerHeight: 56,
};

export default spacing;
