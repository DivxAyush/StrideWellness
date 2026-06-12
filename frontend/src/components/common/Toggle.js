/**
 * Toggle — Custom switch matching the Stride design (green accent).
 */

import React, { useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
  useDerivedValue,
} from 'react-native-reanimated';
import { colors } from '../../theme';

const Toggle = ({
  value = false,
  onValueChange,
  disabled = false,
  size = 'md',
}) => {
  const toggleAnim = useDerivedValue(() => {
    return withSpring(value ? 1 : 0, { damping: 15, stiffness: 200 });
  }, [value]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      toggleAnim.value,
      [0, 1],
      [colors.toggleTrack, colors.toggleTrackActive]
    ),
  }));

  const thumbStyle = useAnimatedStyle(() => {
    const width = size === 'sm' ? 36 : 48;
    const thumbSize = size === 'sm' ? 18 : 24;
    const padding = 3;
    const maxTranslate = width - thumbSize - padding * 2;

    return {
      transform: [
        {
          translateX: toggleAnim.value * maxTranslate,
        },
      ],
    };
  });

  const dimensions = size === 'sm'
    ? { width: 36, height: 22, thumbSize: 18 }
    : { width: 48, height: 28, thumbSize: 24 };

  return (
    <Pressable
      onPress={() => !disabled && onValueChange?.(!value)}
      disabled={disabled}
      style={[disabled && styles.disabled]}
    >
      <Animated.View
        style={[
          styles.track,
          {
            width: dimensions.width,
            height: dimensions.height,
            borderRadius: dimensions.height / 2,
          },
          trackStyle,
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              width: dimensions.thumbSize,
              height: dimensions.thumbSize,
              borderRadius: dimensions.thumbSize / 2,
            },
            thumbStyle,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    justifyContent: 'center',
    padding: 3,
  },
  thumb: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  disabled: {
    opacity: 0.4,
  },
});

export default Toggle;
