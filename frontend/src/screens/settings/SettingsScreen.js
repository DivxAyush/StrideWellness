/**
 * SettingsScreen — App settings and preferences
 * Matches the Stride concept Settings design.
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { logoutRequest } from '../../redux/slices/authSlice';
import SafeContainer from '../../components/common/SafeContainer';
import Toggle from '../../components/common/Toggle';

const SettingsGroup = ({ title, children, delay }) => (
  <Animated.View entering={FadeInUp.delay(delay)} style={styles.groupContainer}>
    {title && <Text style={styles.groupTitle}>{title}</Text>}
    <View style={styles.groupCard}>
      {children}
    </View>
  </Animated.View>
);

const SettingsItem = ({ label, toggle, value, onValueChange, icon, onPress, isLast }) => (
  <Pressable
    style={[styles.itemContainer, !isLast && styles.itemBorder]}
    onPress={onPress}
    disabled={toggle || !onPress}
  >
    <Text style={[styles.itemLabel, icon && { color: colors.error }]}>{label}</Text>
    {toggle ? (
      <Toggle value={value} onValueChange={onValueChange} />
    ) : icon ? (
      <Ionicons name={icon} size={20} color={colors.textSecondary} />
    ) : (
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    )}
  </Pressable>
);

const SettingsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState({
    goalReminder: true,
    dailySummary: true,
  });

  const handleToggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    dispatch(logoutRequest());
  };

  return (
    <SafeContainer>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <Animated.View entering={FadeInUp.delay(100)} style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Control and customization</Text>
          <Text style={styles.headerDesc}>
            Settings provide control over privacy, sync, and app preferences.
          </Text>
        </Animated.View>

        <SettingsGroup title="Notifications" delay={200}>
          <SettingsItem
            label="Goal reminder"
            toggle
            value={notifications.goalReminder}
            onValueChange={() => handleToggle('goalReminder')}
          />
          <SettingsItem
            label="Daily summary"
            toggle
            value={notifications.dailySummary}
            onValueChange={() => handleToggle('dailySummary')}
            isLast
          />
        </SettingsGroup>

        <SettingsGroup title="Tracking source" delay={300}>
          <Pressable style={styles.trackingSource}>
            <Text style={styles.trackingSourceText}>Data source — Phone</Text>
            <View style={styles.connectWrap}>
              <Text style={styles.connectText}>Connect</Text>
              <Ionicons name="watch-outline" size={16} color={colors.primary} />
            </View>
          </Pressable>
        </SettingsGroup>

        <SettingsGroup title="Data" delay={400}>
          <SettingsItem label="Export data" onPress={() => {}} />
          <SettingsItem label="Delete data" onPress={() => {}} isLast />
        </SettingsGroup>

        <SettingsGroup title="Account" delay={500}>
          <View style={styles.accountActionsRow}>
            <Pressable style={[styles.accountButton, styles.deleteAccountBtn]}>
              <Ionicons name="trash-outline" size={18} color={colors.error} />
              <Text style={styles.deleteAccountText}>Delete account</Text>
            </Pressable>
            <Pressable style={styles.accountButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={18} color={colors.textPrimary} />
              <Text style={styles.logoutText}>Log out</Text>
            </Pressable>
          </View>
        </SettingsGroup>

        <SettingsGroup title="Legal" delay={600}>
          <SettingsItem label="Privacy Policy" onPress={() => {}} />
          <SettingsItem label="Terms of Use" onPress={() => {}} />
          <SettingsItem label="Licenses" onPress={() => {}} isLast />
        </SettingsGroup>

        <SettingsGroup title="About" delay={700}>
          <View style={styles.aboutRow}>
            <Text style={styles.itemLabel}>Version 1.0.0</Text>
          </View>
        </SettingsGroup>
        
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: spacing.xs,
    marginLeft: -spacing.xs,
  },
  title: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  headerTextContainer: {
    marginVertical: spacing.lg,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  headerDesc: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  groupContainer: {
    marginBottom: spacing.xl,
  },
  groupTitle: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  groupCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.base,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  itemLabel: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  trackingSource: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.base,
  },
  trackingSourceText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  connectWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  connectText: {
    ...typography.bodyMedium,
    color: colors.primary,
  },
  accountActionsRow: {
    flexDirection: 'row',
    padding: spacing.sm,
    gap: spacing.sm,
  },
  accountButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.secondaryBackground,
    gap: spacing.sm,
  },
  deleteAccountBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  deleteAccountText: {
    ...typography.bodyMedium,
    color: colors.error,
  },
  logoutText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  aboutRow: {
    padding: spacing.base,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default SettingsScreen;
