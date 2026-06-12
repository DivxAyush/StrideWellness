/**
 * AnimatedNumber — Animated counter that counts up on mount.
 */

import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  useDerivedValue,
  Easing,
} from 'react-native-reanimated';
import { colors, typography } from '../../theme';

const AnimatedText = Animated.createAnimatedComponent(Text);

const AnimatedNumber = ({
  value = 0,
  duration = 1200,
  style,
  prefix = '',
  suffix = '',
  decimals = 0,
  formatter,
}) => {
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(value, {
      duration,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [value]);

  const displayValue = useDerivedValue(() => {
    const current = animatedValue.value;
    if (formatter) {
      return `${prefix}${formatter(current)}${suffix}`;
    }
    return `${prefix}${current.toFixed(decimals)}${suffix}`;
  });

  const animatedProps = useAnimatedProps(() => ({
    text: displayValue.value,
  }));

  // Since animatedProps with text doesn't work cleanly in all RN versions,
  // we use a simpler approach with state
  return (
    <AnimatedTextDisplay
      value={value}
      duration={duration}
      style={style}
      prefix={prefix}
      suffix={suffix}
      decimals={decimals}
      formatter={formatter}
    />
  );
};

// Simpler implementation using JS thread
const AnimatedTextDisplay = ({
  value,
  duration,
  style,
  prefix,
  suffix,
  decimals,
  formatter,
}) => {
  const [displayValue, setDisplayValue] = React.useState(0);

  useEffect(() => {
    let startTime = null;
    let startValue = displayValue;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (value - startValue) * eased;
      setDisplayValue(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value]);

  const formatted = formatter
    ? `${prefix}${formatter(displayValue)}${suffix}`
    : `${prefix}${displayValue.toFixed(decimals)}${suffix}`;

  return (
    <Text style={[styles.text, style]}>{formatted}</Text>
  );
};

const styles = StyleSheet.create({
  text: {
    ...typography.statValue,
    color: colors.textPrimary,
  },
});

export default AnimatedNumber;
