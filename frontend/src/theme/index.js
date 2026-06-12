/**
 * Stride Wellness — Unified Theme
 * 
 * Single import for the entire design system.
 */

import { colors } from './colors';
import { typography, fontFamilies, fontSizes, lineHeights, letterSpacing } from './typography';
import { spacing, borderRadius, iconSizes, hitSlop, layout } from './spacing';

export const shadows = {
  sm: {
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: colors.shadowPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 6,
  },
  card: {
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
};

export const glassmorphism = {
  light: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: borderRadius.xl,
  },
  medium: {
    backgroundColor: 'rgba(36, 40, 51, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: borderRadius.xl,
  },
  heavy: {
    backgroundColor: 'rgba(36, 40, 51, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: borderRadius.xl,
  },
};

const theme = {
  colors,
  typography,
  fontFamilies,
  fontSizes,
  lineHeights,
  letterSpacing,
  spacing,
  borderRadius,
  iconSizes,
  hitSlop,
  layout,
  shadows,
  glassmorphism,
};

export {
  colors,
  typography,
  fontFamilies,
  fontSizes,
  lineHeights,
  letterSpacing,
  spacing,
  borderRadius,
  iconSizes,
  hitSlop,
  layout,
};

export default theme;
