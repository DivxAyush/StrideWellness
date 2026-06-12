/**
 * StatCard — Quick stat display card used in Home and Activity screens.
 * Shows icon, value, and label in the Stride card style.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { colors, typography, borderRadius, spacing } from '../../theme';

const StatCard = ({
  icon,
  value,
  label,
  unit,
  delay = 0,
  style,
  iconColor = colors.primary,
  compact = false,
}) => {
  return (
    <Animated.View
      entering={FadeInUp.delay(delay).duration(500).springify()}
      style={[styles.container, compact && styles.containerCompact, style]}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
        {icon}
      </View>
      <View style={styles.valueContainer}>
        <Text style={[styles.label, compact && styles.labelCompact]}>{label}</Text>
        <View style={styles.valueRow}>
          <Text style={[styles.value, compact && styles.valueCompact]}>{value}</Text>
          {unit && <Text style={styles.unit}> {unit}</Text>}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    flex: 1,
  },
  containerCompact: {
    padding: spacing.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  valueContainer: {
    flex: 1,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xxs,
  },
  labelCompact: {
    fontSize: 10,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  valueCompact: {
    ...typography.h3,
  },
  unit: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});

export default StatCard;
