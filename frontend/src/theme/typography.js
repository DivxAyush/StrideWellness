/**
 * Stride Wellness — Typography System
 * 
 * SF Pro-inspired typography using Inter (closest Google Font).
 * Clean, readable, and modern.
 */

export const fontFamilies = {
  light: 'Inter_300Light',
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export const fontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  display: 32,
  hero: 40,
  giant: 56,
};

export const lineHeights = {
  tight: 1.1,
  snug: 1.25,
  normal: 1.4,
  relaxed: 1.6,
  loose: 1.8,
};

export const letterSpacing = {
  tighter: -0.8,
  tight: -0.4,
  normal: 0,
  wide: 0.4,
  wider: 0.8,
  widest: 1.2,
};

// Pre-built typography styles
export const typography = {
  hero: {
    fontSize: fontSizes.hero,
    fontFamily: fontFamilies.bold,
    letterSpacing: letterSpacing.tighter,
    lineHeight: fontSizes.hero * lineHeights.tight,
  },
  display: {
    fontSize: fontSizes.display,
    fontFamily: fontFamilies.bold,
    letterSpacing: letterSpacing.tight,
    lineHeight: fontSizes.display * lineHeights.snug,
  },
  h1: {
    fontSize: fontSizes.xxl,
    fontFamily: fontFamilies.bold,
    letterSpacing: letterSpacing.tight,
    lineHeight: fontSizes.xxl * lineHeights.snug,
  },
  h2: {
    fontSize: fontSizes.xl,
    fontFamily: fontFamilies.semiBold,
    letterSpacing: letterSpacing.tight,
    lineHeight: fontSizes.xl * lineHeights.snug,
  },
  h3: {
    fontSize: fontSizes.lg,
    fontFamily: fontFamilies.semiBold,
    letterSpacing: letterSpacing.normal,
    lineHeight: fontSizes.lg * lineHeights.normal,
  },
  body: {
    fontSize: fontSizes.base,
    fontFamily: fontFamilies.regular,
    letterSpacing: letterSpacing.normal,
    lineHeight: fontSizes.base * lineHeights.relaxed,
  },
  bodyMedium: {
    fontSize: fontSizes.base,
    fontFamily: fontFamilies.medium,
    letterSpacing: letterSpacing.normal,
    lineHeight: fontSizes.base * lineHeights.normal,
  },
  bodySm: {
    fontSize: fontSizes.md,
    fontFamily: fontFamilies.regular,
    letterSpacing: letterSpacing.normal,
    lineHeight: fontSizes.md * lineHeights.relaxed,
  },
  caption: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.regular,
    letterSpacing: letterSpacing.wide,
    lineHeight: fontSizes.sm * lineHeights.normal,
  },
  captionMedium: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.medium,
    letterSpacing: letterSpacing.wide,
    lineHeight: fontSizes.sm * lineHeights.normal,
  },
  label: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamilies.medium,
    letterSpacing: letterSpacing.wider,
    lineHeight: fontSizes.xs * lineHeights.normal,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: fontSizes.xxl,
    fontFamily: fontFamilies.bold,
    letterSpacing: letterSpacing.tight,
    lineHeight: fontSizes.xxl * lineHeights.tight,
  },
  statLabel: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.regular,
    letterSpacing: letterSpacing.wide,
    lineHeight: fontSizes.sm * lineHeights.normal,
  },
  button: {
    fontSize: fontSizes.base,
    fontFamily: fontFamilies.semiBold,
    letterSpacing: letterSpacing.wide,
    lineHeight: fontSizes.base * lineHeights.normal,
  },
  buttonSm: {
    fontSize: fontSizes.md,
    fontFamily: fontFamilies.semiBold,
    letterSpacing: letterSpacing.wide,
    lineHeight: fontSizes.md * lineHeights.normal,
  },
  tab: {
    fontSize: fontSizes.md,
    fontFamily: fontFamilies.medium,
    letterSpacing: letterSpacing.normal,
    lineHeight: fontSizes.md * lineHeights.normal,
  },
  input: {
    fontSize: fontSizes.base,
    fontFamily: fontFamilies.regular,
    letterSpacing: letterSpacing.normal,
    lineHeight: fontSizes.base * lineHeights.normal,
  },
};

export default typography;
