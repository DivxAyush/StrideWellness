/**
 * HomeScreen — The main dashboard
 */

import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, RefreshControl } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import * as Haptics from 'expo-haptics';

import { colors, typography, spacing, borderRadius } from '../../theme';
import { getRelativeDay, formatSteps, formatNumber } from '../../utils/formatters';
import { fetchDailyActivityRequest } from '../../redux/slices/activitySlice';
import { usePedometer } from '../../hooks/usePedometer';

import SafeContainer from '../../components/common/SafeContainer';
import Avatar from '../../components/common/Avatar';
import ProgressRing from '../../components/common/ProgressRing';
import StatCard from '../../components/common/StatCard';
import SectionHeader from '../../components/common/SectionHeader';
import ActivityChart from '../../components/charts/ActivityChart';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    liveSteps, dailySteps, goalSteps, calories, distance, activeTime, intensity, isLoading, hourlyData,
  } = useSelector((state) => state.activity);
  
  // Start pedometer
  usePedometer();

  // Prefer live sensor steps over mock daily steps
  const currentSteps = liveSteps || dailySteps;

  useEffect(() => {
    dispatch(fetchDailyActivityRequest(new Date().toISOString()));
  }, [dispatch]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Vibrate when pulled
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Dispatch fetch to update stats
    dispatch(fetchDailyActivityRequest(new Date().toISOString()));
    // Simulate network delay for the animation
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, [dispatch]);

  const progressPercentage = Math.min(Math.round((currentSteps / goalSteps) * 100), 100);
  const remainingSteps = Math.max(goalSteps - currentSteps, 0);

  // Calculate live derived stats based on currentSteps
  const liveDistance = currentSteps > dailySteps ? ((currentSteps * 0.762) / 1000).toFixed(2) : distance;
  const liveCalories = currentSteps > dailySteps ? Math.round(currentSteps * 0.04) : calories;

  return (
    <SafeContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={colors.primary} 
            colors={[colors.primary]} 
          />
        }
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'Guest'}!</Text>
            <Text style={styles.date}>{getRelativeDay()}</Text>
          </View>
          <Pressable onPress={() => navigation.navigate('Profile')}>
            <Avatar name={user?.name || 'Guest'} source={user?.avatar} />
          </Pressable>
        </Animated.View>

        {/* Main Wellness Card */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.mainCard}>
          <View style={styles.mainCardContent}>
            <ProgressRing
              progress={progressPercentage}
              size={120}
              strokeWidth={12}
              duration={1500}
            />
            <View style={styles.mainCardInfo}>
              <Text style={styles.stepsLabel}>Steps</Text>
              <View style={styles.stepsValueContainer}>
                <Text style={styles.shoeIcon}>👟 </Text>
                <Text style={styles.stepsValue}>{formatSteps(currentSteps)}</Text>
              </View>
              <Text style={styles.goalText}>
                Goal <Text style={styles.goalValue}>{formatSteps(goalSteps)}</Text>
              </Text>
              <Pressable
                style={styles.remainingBadge}
                onPress={() => navigation.navigate('Goals')}
              >
                <Text style={styles.remainingText}>
                  {formatSteps(remainingSteps)} steps to go
                </Text>
                <Ionicons name="arrow-forward" size={12} color={colors.primary} />
              </Pressable>
            </View>
          </View>
        </Animated.View>

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard
              icon={<Ionicons name="flame" size={20} color={colors.warning} />}
              iconColor={colors.warning}
              value={formatNumber(liveCalories)}
              unit="kcal"
              label="Calories"
              delay={300}
            />
            <View style={{ width: spacing.md }} />
            <StatCard
              icon={<Ionicons name="speedometer" size={20} color={colors.primary} />}
              iconColor={colors.primary}
              value={intensity || '0:00'}
              unit="min/km"
              label="Activity intensity"
              delay={400}
            />
          </View>
          <View style={{ height: spacing.md }} />
          <View style={styles.statsRow}>
            <StatCard
              icon={<Ionicons name="time" size={20} color={colors.primary} />}
              iconColor={colors.primary}
              value={activeTime}
              unit="min"
              label="Active time"
              delay={500}
            />
            <View style={{ width: spacing.md }} />
            <StatCard
              icon={<Ionicons name="analytics" size={20} color={colors.primary} />}
              iconColor={colors.primary}
              value={liveDistance}
              unit="km"
              label="Distance"
              delay={600}
            />
          </View>
        </View>

        {/* Activity Chart */}
        <Animated.View entering={FadeInUp.delay(700)} style={styles.chartSection}>
          <SectionHeader
            title="Today's activity"
            action="View details"
            onAction={() => navigation.navigate('Reports')}
          />
          <ActivityChart data={hourlyData} />
        </Animated.View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  greeting: {
    ...typography.bodySm,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  date: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  mainCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.xxl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  mainCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainCardInfo: {
    flex: 1,
    marginLeft: spacing.xl,
    alignItems: 'flex-end',
  },
  stepsLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  stepsValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.xs,
  },
  shoeIcon: {
    fontSize: 24,
    color: colors.primary,
  },
  stepsValue: {
    ...typography.display,
    color: colors.primary,
    letterSpacing: -1,
  },
  goalText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  goalValue: {
    color: colors.textPrimary,
    fontFamily: 'Inter_600SemiBold',
  },
  remainingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(160, 202, 255, 0.1)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
  },
  remainingText: {
    ...typography.caption,
    color: colors.secondaryAccent,
    fontSize: 11,
  },
  statsGrid: {
    marginBottom: spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
  },
  chartSection: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.xxl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default HomeScreen;
