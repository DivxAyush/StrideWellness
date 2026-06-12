/**
 * GoalsScreen — Manage step, water, and weight goals
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import SafeContainer from '../../components/common/SafeContainer';
import ProgressRing from '../../components/common/ProgressRing';

const GoalCard = ({ title, current, target, unit, icon, color, delay }) => {
  const progress = Math.min((current / target) * 100, 100);

  return (
    <Animated.View entering={FadeInUp.delay(delay)} style={styles.goalCard}>
      <View style={styles.goalInfo}>
        <View style={[styles.iconWrap, { backgroundColor: `${color}15` }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
        <Text style={styles.goalTitle}>{title}</Text>
        <Text style={styles.goalProgress}>
          <Text style={styles.current}>{current}</Text> / {target} {unit}
        </Text>
      </View>
      <ProgressRing progress={progress} size={64} strokeWidth={6} color={color} percentageSize={14} />
    </Animated.View>
  );
};

const GoalsScreen = () => {
  return (
    <SafeContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Goals</Text>
        <Pressable style={styles.addButton}>
          <Ionicons name="add" size={24} color={colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.delay(100)}>
          <Text style={styles.sectionTitle}>Daily Goals</Text>
        </Animated.View>

        <GoalCard
          title="Daily Steps"
          current={8500}
          target={10000}
          unit="steps"
          icon="walk"
          color={colors.primary}
          delay={200}
        />

        <GoalCard
          title="Hydration"
          current={2.5}
          target={4.0}
          unit="L"
          icon="water"
          color={colors.secondaryAccent}
          delay={300}
        />

        <Animated.View entering={FadeInDown.delay(400)} style={{ marginTop: spacing.xl }}>
          <Text style={styles.sectionTitle}>Long-term Goals</Text>
        </Animated.View>

        <GoalCard
          title="Target Weight"
          current={75}
          target={70}
          unit="kg"
          icon="barbell"
          color={colors.warning}
          delay={500}
        />
      </ScrollView>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  sectionTitle: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  goalCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  goalInfo: {
    flex: 1,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  goalTitle: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  goalProgress: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  current: {
    color: colors.textPrimary,
    fontFamily: 'Inter_600SemiBold',
  },
});

export default GoalsScreen;
