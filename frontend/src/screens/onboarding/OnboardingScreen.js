/**
 * OnboardingScreen — 3-screen swipeable onboarding.
 * Matches the Stride concept onboarding design.
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, FlatList, Dimensions, StyleSheet, Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
  FadeInUp,
  FadeIn,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { ONBOARDING_SLIDES } from '../../constants/app';
import Button from '../../components/common/Button';
import ProgressRing from '../../components/common/ProgressRing';

const { width, height } = Dimensions.get('window');
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const OnboardingScreen = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const goToNext = useCallback(() => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      onComplete?.();
    }
  }, [currentIndex, onComplete]);

  const renderSlide = ({ item, index }) => (
    <SlideContent item={item} index={index} scrollX={scrollX} />
  );

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      {currentIndex < ONBOARDING_SLIDES.length - 1 && (
        <Pressable style={styles.skipButton} onPress={onComplete}>
          <Text style={styles.skipText}>Skip</Text>
          <Ionicons name="arrow-forward" size={14} color={colors.primary} />
        </Pressable>
      )}

      {/* Slides */}
      <AnimatedFlatList
        ref={flatListRef}
        data={ONBOARDING_SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />

      {/* Bottom Controls */}
      <View style={styles.bottomContainer}>
        {/* Dots */}
        <View style={styles.dotsContainer}>
          {ONBOARDING_SLIDES.map((_, index) => (
            <DotIndicator key={index} index={index} scrollX={scrollX} />
          ))}
        </View>

        {/* CTA Button */}
        <Button
          title={currentIndex === ONBOARDING_SLIDES.length - 1 ? 'Get started' : 'Continue'}
          onPress={goToNext}
          fullWidth
          size="lg"
          style={styles.ctaButton}
        />
      </View>
    </View>
  );
};

// Slide Content Component
const SlideContent = ({ item, index, scrollX }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    const opacity = interpolate(scrollX.value, inputRange, [0.3, 1, 0.3], Extrapolation.CLAMP);
    const translateY = interpolate(scrollX.value, inputRange, [30, 0, 30], Extrapolation.CLAMP);
    const scale = interpolate(scrollX.value, inputRange, [0.9, 1, 0.9], Extrapolation.CLAMP);

    return { opacity, transform: [{ translateY }, { scale }] };
  });

  return (
    <View style={styles.slide}>
      <Animated.View style={[styles.slideContent, animatedStyle]}>
        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          {index === 0 && <ActivityIllustration />}
          {index === 1 && <GoalIllustration />}
          {index === 2 && <HabitIllustration />}
        </View>

        {/* Text */}
        <Text style={styles.slideTitle}>{item.title}</Text>
        <Text style={styles.slideDescription}>{item.description}</Text>
      </Animated.View>
    </View>
  );
};

// Miniature Activity Chart Illustration
const ActivityIllustration = () => (
  <View style={styles.illustrationCard}>
    <View style={styles.miniStatRow}>
      <View style={styles.miniStat}>
        <Text style={styles.miniStatValue}>52 min</Text>
        <Text style={styles.miniStatLabel}>Active time</Text>
      </View>
      <View style={styles.miniStat}>
        <Text style={styles.miniStatValue}>6.5 km</Text>
        <Text style={styles.miniStatLabel}>Distance</Text>
      </View>
    </View>
    <View style={styles.miniChart}>
      <View style={styles.miniChartBar}>
        <View style={[styles.chartBarFill, { height: '60%' }]} />
      </View>
      <View style={styles.miniChartBar}>
        <View style={[styles.chartBarFill, { height: '80%' }]} />
      </View>
      <View style={styles.miniChartBar}>
        <View style={[styles.chartBarFill, { height: '45%' }]} />
      </View>
      <View style={styles.miniChartBar}>
        <View style={[styles.chartBarFill, { height: '90%' }]} />
      </View>
      <View style={styles.miniChartBar}>
        <View style={[styles.chartBarFill, { height: '70%' }]} />
      </View>
      <View style={styles.miniChartBar}>
        <View style={[styles.chartBarFill, { height: '55%' }]} />
      </View>
      <View style={styles.miniChartBar}>
        <View style={[styles.chartBarFill, { height: '85%' }]} />
      </View>
    </View>
  </View>
);

// Goal Progress Illustration (matching concept Screen 2)
const GoalIllustration = () => (
  <View style={styles.illustrationCard}>
    <View style={styles.goalRow}>
      <ProgressRing progress={85} size={80} strokeWidth={8} />
      <View style={styles.goalInfo}>
        <Text style={styles.goalSteps}>👟 8,500</Text>
        <Text style={styles.goalSubtext}>Goal 10,000</Text>
        <Text style={styles.goalRemaining}>1,500 steps to go</Text>
      </View>
    </View>
    <View style={styles.miniStatRow}>
      <View style={[styles.miniStat, styles.miniStatCard]}>
        <Text style={styles.miniStatValue}>400 kcal</Text>
        <Text style={styles.miniStatLabel}>Calories</Text>
      </View>
      <View style={[styles.miniStat, styles.miniStatCard]}>
        <Text style={styles.miniStatValue}>9:45</Text>
        <Text style={styles.miniStatLabel}>min/km</Text>
      </View>
    </View>
  </View>
);

// Habit Building Illustration (matching concept Screen 3)
const HabitIllustration = () => (
  <View style={styles.illustrationCard}>
    <View style={styles.goalRow}>
      <ProgressRing progress={100} size={80} strokeWidth={8} />
      <View style={styles.goalInfo}>
        <Text style={styles.goalSteps}>👟 10,000</Text>
        <Text style={styles.goalComplete}>Nice work!</Text>
        <Text style={styles.goalCompleteSubtext}>You reached your daily goal 🎉</Text>
      </View>
    </View>
  </View>
);

// Animated Dot Indicator
const DotIndicator = ({ index, scrollX }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    const dotWidth = interpolate(scrollX.value, inputRange, [8, 24, 8], Extrapolation.CLAMP);
    const opacity = interpolate(scrollX.value, inputRange, [0.3, 1, 0.3], Extrapolation.CLAMP);

    return { width: dotWidth, opacity };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
  },
  skipText: {
    ...typography.bodySm,
    color: colors.primary,
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  slideContent: {
    alignItems: 'center',
  },
  illustrationContainer: {
    marginBottom: spacing.xxl,
    width: '100%',
  },
  slideTitle: {
    ...typography.h1,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  slideDescription: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.lg,
  },
  bottomContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 50,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  ctaButton: {
    marginBottom: spacing.md,
  },
  // Illustration styles
  illustrationCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    width: '100%',
  },
  miniStatRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  miniStat: {
    flex: 1,
  },
  miniStatCard: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  miniStatValue: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  miniStatLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  miniChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 60,
    gap: 8,
  },
  miniChartBar: {
    flex: 1,
    height: '100%',
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  chartBarFill: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    width: '100%',
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
  },
  goalInfo: {
    flex: 1,
  },
  goalSteps: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  goalSubtext: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  goalRemaining: {
    ...typography.caption,
    color: colors.primary,
    marginTop: 2,
  },
  goalComplete: {
    ...typography.bodyMedium,
    color: colors.primary,
    marginTop: 2,
  },
  goalCompleteSubtext: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

export default OnboardingScreen;
