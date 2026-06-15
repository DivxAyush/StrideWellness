/**
 * WaterScreen — Hydration tracking
 */

import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { colors, typography, spacing, borderRadius } from '../../theme';
import SafeContainer from '../../components/common/SafeContainer';
import ProgressRing from '../../components/common/ProgressRing';
import { addWaterRequest, fetchDailyWaterRequest, fetchOverallWaterRequest } from '../../redux/slices/waterSlice';

const QUICK_ACTIONS = [
  { amount: 250, label: 'Glass', icon: 'water-outline' },
  { amount: 500, label: 'Bottle', icon: 'flask-outline' },
  { amount: 1000, label: 'Large', icon: 'beaker-outline' },
];

const WaterScreen = () => {
  const dispatch = useDispatch();
  const { currentIntake, dailyGoal, logs, overallData } = useSelector((state) => state.water);

  useEffect(() => {
    dispatch(fetchDailyWaterRequest(new Date().toISOString()));
    dispatch(fetchOverallWaterRequest());
  }, [dispatch]);

  const handleAddWater = (amount) => {
    dispatch(addWaterRequest({ amount, type: 'quick' }));
  };

  const progress = Math.min((currentIntake / dailyGoal) * 100, 100);

  return (
    <SafeContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Hydration</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Main Dashboard Card */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.dashboardCard}>
          <Text style={styles.dashboardTitle}>Daily Goal</Text>
          <Text style={styles.goalText}>{(dailyGoal / 1000).toFixed(1)} Liters</Text>
          
          <View style={styles.ringContainer}>
            <ProgressRing
              progress={progress}
              size={220}
              strokeWidth={18}
              color={colors.secondaryAccent}
              showPercentage={false}
            >
              <View style={styles.ringInner}>
                <Ionicons name="water" size={32} color={colors.secondaryAccent} style={styles.waterIcon} />
                <Text style={styles.currentIntake}>{(currentIntake / 1000).toFixed(1)}L</Text>
                <Text style={styles.intakeLabel}>consumed today</Text>
              </View>
            </ProgressRing>
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Add</Text>
          <View style={styles.actionsGrid}>
            {QUICK_ACTIONS.map((action, index) => (
              <Pressable
                key={index}
                style={styles.actionButton}
                onPress={() => handleAddWater(action.amount)}
              >
                <View style={styles.actionIconWrap}>
                  <Ionicons name={action.icon} size={24} color={colors.secondaryAccent} />
                </View>
                <Text style={styles.actionAmount}>+{action.amount}ml</Text>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>
        
        {/* History / Today's Log */}
        <Animated.View entering={FadeInUp.delay(300)} style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>Today's Log</Text>
          {(!logs || logs.length === 0) ? (
            <View style={styles.emptyState}>
              <Ionicons name="list" size={32} color={colors.textTertiary} />
              <Text style={styles.emptyStateText}>Your drinks will appear here.</Text>
            </View>
          ) : (
            <View style={styles.logList}>
              {logs.map((log, index) => {
                const logTime = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return (
                  <View key={index} style={styles.logItem}>
                    <View style={styles.logLeft}>
                      <View style={styles.logIconWrap}>
                        <Ionicons name="water" size={16} color={colors.secondaryAccent} />
                      </View>
                      <View>
                        <Text style={styles.logAmount}>{log.amount} ml</Text>
                        <Text style={styles.logTime}>{logTime}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </Animated.View>

        {/* Lifetime Stats */}
        <Animated.View entering={FadeInUp.delay(400)} style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>Lifetime Stats</Text>
          <View style={styles.statsCard}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Logs Recorded</Text>
              <Text style={styles.statValue}>
                {overallData?.reduce((acc, day) => acc + (day.logs?.length || 0), 0) || 0} times
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Water Consumed</Text>
              <Text style={styles.statValue}>
                {((overallData?.reduce((acc, day) => acc + (day.totalIntake || 0), 0) || 0) / 1000).toFixed(1)} L
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Days Tracked</Text>
              <Text style={styles.statValue}>{overallData?.length || 0} days</Text>
            </View>
          </View>
        </Animated.View>
        
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  dashboardCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.xxl,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  dashboardTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  goalText: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  ringContainer: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  ringInner: {
    alignItems: 'center',
  },
  waterIcon: {
    marginBottom: spacing.sm,
  },
  currentIntake: {
    ...typography.display,
    color: colors.textPrimary,
    lineHeight: 40,
  },
  intakeLabel: {
    ...typography.caption,
    color: colors.secondaryAccent,
    marginTop: spacing.xs,
  },
  quickActionsContainer: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    alignItems: 'center',
    width: '31%',
  },
  actionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(160, 202, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  actionAmount: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  actionLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  historyContainer: {
    marginBottom: spacing.xl,
  },
  emptyState: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    ...typography.body,
    color: colors.textTertiary,
    marginTop: spacing.sm,
  },
  logList: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  logLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  logAmount: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  logTime: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  statsCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  statLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  statValue: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  statDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.md,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default WaterScreen;
