/**
 * Button — Premium button with Reanimated press animation.
 * Variants: primary, secondary, outline, ghost
 */

import React, { useCallback } from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { colors, typography, borderRadius, spacing } from '../../theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  }, []);

  const variantStyles = getVariantStyles(variant, disabled);

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        styles.base,
        styles[size],
        variantStyles.container,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        animatedStyle,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variantStyles.textColor}
        />
      ) : (
        <>
          {icon && icon}
          <Text
            style={[
              styles.text,
              styles[`text_${size}`],
              { color: variantStyles.textColor },
              icon && styles.textWithIcon,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </AnimatedPressable>
  );
};

function getVariantStyles(variant, disabled) {
  const opacity = disabled ? 0.4 : 1;

  switch (variant) {
    case 'primary':
      return {
        container: {
          backgroundColor: colors.primary,
          opacity,
        },
        textColor: colors.textInverse,
      };
    case 'secondary':
      return {
        container: {
          backgroundColor: colors.cardBackground,
          opacity,
        },
        textColor: colors.textPrimary,
      };
    case 'outline':
      return {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: colors.primary,
          opacity,
        },
        textColor: colors.primary,
      };
    case 'ghost':
      return {
        container: {
          backgroundColor: 'transparent',
          opacity,
        },
        textColor: colors.primary,
      };
    case 'danger':
      return {
        container: {
          backgroundColor: colors.errorMuted,
          opacity,
        },
        textColor: colors.error,
      };
    default:
      return {
        container: {
          backgroundColor: colors.primary,
          opacity,
        },
        textColor: colors.textInverse,
      };
  }
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.xl,
  },
  sm: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    minHeight: 36,
  },
  md: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 48,
  },
  lg: {
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.xxl,
    minHeight: 56,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    ...typography.button,
  },
  text_sm: {
    ...typography.buttonSm,
  },
  text_md: {
    ...typography.button,
  },
  text_lg: {
    ...typography.button,
    fontSize: 18,
  },
  textWithIcon: {
    marginLeft: spacing.sm,
  },
});

export default Button;
