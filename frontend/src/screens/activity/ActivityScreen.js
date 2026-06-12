/**
 * ActivityScreen — Detailed activity analytics
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import SafeContainer from '../../components/common/SafeContainer';
import TabSelector from '../../components/common/TabSelector';
import { ACTIVITY_TABS } from '../../constants/app';
import StatCard from '../../components/common/StatCard';
import SectionHeader from '../../components/common/SectionHeader';
import ActivityChart from '../../components/charts/ActivityChart';
import { useSelector } from 'react-redux';
import { formatSteps } from '../../utils/formatters';

const ActivityScreen = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { liveSteps, dailySteps } = useSelector((state) => state.activity);
  const currentSteps = liveSteps || dailySteps;

  return (
    <SafeContainer>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Activity</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Tabs */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.tabsContainer}>
          <TabSelector
            tabs={ACTIVITY_TABS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </Animated.View>

        {/* Chart */}
        <Animated.View entering={FadeInUp.delay(200)}>
          <ActivityChart delay={0} />
        </Animated.View>

        {/* Summary Stats */}
        <Animated.View entering={FadeInUp.delay(300)} style={styles.statsContainer}>
          <SectionHeader title={`${ACTIVITY_TABS[activeTab]} Summary`} />
          <View style={styles.statsGrid}>
            <View style={styles.statsRow}>
              <StatCard
                icon={<Text style={{ fontSize: 16 }}>👟</Text>}
                iconColor={colors.primary}
                value={formatSteps(currentSteps)}
                label="Total Steps"
                compact
              />
              <View style={{ width: spacing.md }} />
              <StatCard
                icon={<Ionicons name="flame" size={16} color={colors.warning} />}
                iconColor={colors.warning}
                value="400"
                unit="kcal"
                label="Calories"
                compact
              />
            </View>
            <View style={{ height: spacing.md }} />
            <View style={styles.statsRow}>
              <StatCard
                icon={<Ionicons name="analytics" size={16} color={colors.secondaryAccent} />}
                iconColor={colors.secondaryAccent}
                value="6.5"
                unit="km"
                label="Distance"
                compact
              />
              <View style={{ width: spacing.md }} />
              <StatCard
                icon={<Ionicons name="time" size={16} color={colors.primary} />}
                iconColor={colors.primary}
                value="52"
                unit="min"
                label="Active Time"
                compact
              />
            </View>
          </View>
        </Animated.View>

        {/* Insights */}
        <Animated.View entering={FadeInUp.delay(400)} style={styles.insightsContainer}>
          <SectionHeader title="Insights" />
          <View style={styles.insightCard}>
            <View style={styles.insightIconWrap}>
              <Ionicons name="trending-up" size={24} color={colors.primary} />
            </View>
            <View style={styles.insightTextWrap}>
              <Text style={styles.insightTitle}>Great progress!</Text>
              <Text style={styles.insightDesc}>
                You've been more active this week compared to last week. Keep it up!
              </Text>
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
  tabsContainer: {
    marginBottom: spacing.md,
  },
  statsContainer: {
    marginTop: spacing.xl,
  },
  statsGrid: {
    marginTop: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
  },
  insightsContainer: {
    marginTop: spacing.xl,
  },
  insightCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  insightTextWrap: {
    flex: 1,
  },
  insightTitle: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    marginBottom: spacing.xxs,
  },
  insightDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default ActivityScreen;
