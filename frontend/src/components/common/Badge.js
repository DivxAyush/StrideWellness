/**
 * Badge — Achievement badge component.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { colors, typography, borderRadius, spacing } from '../../theme';

const Badge = ({
  icon,
  title,
  description,
  earned = false,
  delay = 0,
  size = 'md',
  style,
}) => {
  return (
    <Animated.View
      entering={ZoomIn.delay(delay).duration(400).springify()}
      style={[
        styles.container,
        size === 'sm' && styles.containerSm,
        !earned && styles.unearned,
        style,
      ]}
    >
      <View style={[styles.iconWrap, earned ? styles.iconEarned : styles.iconUnearned]}>
        {icon}
      </View>
      {title && (
        <Text
          style={[styles.title, !earned && styles.textUnearned]}
          numberOfLines={1}
        >
          {title}
        </Text>
      )}
      {description && size !== 'sm' && (
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing.md,
    width: 100,
  },
  containerSm: {
    width: 80,
    padding: spacing.sm,
  },
  unearned: {
    opacity: 0.4,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  iconEarned: {
    backgroundColor: colors.primaryMuted,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  iconUnearned: {
    backgroundColor: colors.cardBackground,
    borderWidth: 2,
    borderColor: colors.border,
  },
  title: {
    ...typography.captionMedium,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  textUnearned: {
    color: colors.textSecondary,
  },
  description: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xxs,
  },
});

export default Badge;
