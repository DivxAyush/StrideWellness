/**
 * Card — Dark themed card with glassmorphism option.
 * The primary container for content sections.
 */

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInUp,
} from 'react-native-reanimated';
import { colors, borderRadius, spacing, shadows } from '../../theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Card = ({
  children,
  style,
  onPress,
  variant = 'default',
  entering,
  delay = 0,
  pressable = false,
  noPadding = false,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (pressable || onPress) {
      scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    if (pressable || onPress) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  };

  const variantStyle = variantStyles[variant] || variantStyles.default;

  const Container = onPress ? AnimatedPressable : Animated.View;
  const containerProps = onPress
    ? {
        onPress,
        onPressIn: handlePressIn,
        onPressOut: handlePressOut,
      }
    : {};

  return (
    <Container
      entering={entering || FadeInUp.delay(delay).duration(500).springify()}
      style={[
        styles.base,
        variantStyle,
        !noPadding && styles.padding,
        onPress && animatedStyle,
        style,
      ]}
      {...containerProps}
    >
      {children}
    </Container>
  );
};

const variantStyles = {
  default: {
    backgroundColor: colors.cardBackground,
  },
  elevated: {
    backgroundColor: colors.cardBackground,
    ...shadows.card,
  },
  glass: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  accent: {
    backgroundColor: colors.primaryMuted,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.2)',
  },
  transparent: {
    backgroundColor: 'transparent',
  },
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  padding: {
    padding: spacing.base,
  },
});

export default Card;
