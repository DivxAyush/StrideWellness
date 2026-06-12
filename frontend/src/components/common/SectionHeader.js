/**
 * SectionHeader — Section title with optional action link.
 * Example: "Today's Activity    View details →"
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';

const SectionHeader = ({
  title,
  action,
  onAction,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      {action && (
        <Pressable
          onPress={onAction}
          style={styles.actionButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.action}>{action}</Text>
          <Ionicons
            name="arrow-forward"
            size={14}
            color={colors.primary}
            style={styles.arrow}
          />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  action: {
    ...typography.caption,
    color: colors.primary,
  },
  arrow: {
    marginLeft: spacing.xxs,
  },
});

export default SectionHeader;
