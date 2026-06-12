/**
 * SplashScreen — Animated Stride logo splash.
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors, typography, spacing } from '../../theme';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);
  const ringProgress = useSharedValue(0);
  const fadeOut = useSharedValue(1);

  useEffect(() => {
    // Logo entrance
    logoOpacity.value = withTiming(1, { duration: 600 });
    logoScale.value = withTiming(1, {
      duration: 800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });

    // Ring animation
    ringProgress.value = withDelay(300, withTiming(1, { duration: 1200, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }));

    // Text entrance
    textOpacity.value = withDelay(500, withTiming(1, { duration: 500 }));
    taglineOpacity.value = withDelay(800, withTiming(1, { duration: 500 }));

    // Fade out
    fadeOut.value = withDelay(2200, withTiming(0, { duration: 400 }));

    const timer = setTimeout(() => {
      onFinish?.();
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value * fadeOut.value,
    transform: [{ scale: logoScale.value }],
  }));

  const textAnimStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value * fadeOut.value,
  }));

  const taglineAnimStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value * fadeOut.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, logoAnimStyle]}>
        <View style={styles.ringContainer}>
          <Svg width={100} height={100}>
            <Defs>
              <LinearGradient id="splashGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor={colors.primary} />
                <Stop offset="100%" stopColor={colors.primaryDark} />
              </LinearGradient>
            </Defs>
            <Circle
              cx={50}
              cy={50}
              r={40}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={6}
              fill="transparent"
            />
            <Circle
              cx={50}
              cy={50}
              r={40}
              stroke="url(#splashGrad)"
              strokeWidth={6}
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={0}
              transform="rotate(-90 50 50)"
            />
          </Svg>
          <View style={styles.iconInner}>
            <Text style={styles.logoIcon}>👟</Text>
          </View>
        </View>
      </Animated.View>

      <Animated.Text style={[styles.appName, textAnimStyle]}>
        Stride
      </Animated.Text>
      <Animated.Text style={[styles.wellness, textAnimStyle]}>
        Wellness
      </Animated.Text>
      <Animated.Text style={[styles.tagline, taglineAnimStyle]}>
        Track Progress. Build Habits.
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  ringContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInner: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    fontSize: 36,
  },
  appName: {
    fontSize: 42,
    fontFamily: 'Inter_700Bold',
    color: colors.textPrimary,
    letterSpacing: -1,
  },
  wellness: {
    fontSize: 42,
    fontFamily: 'Inter_300Light',
    color: colors.primary,
    letterSpacing: -1,
    marginTop: -8,
  },
  tagline: {
    ...typography.bodySm,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
});

export default SplashScreen;
