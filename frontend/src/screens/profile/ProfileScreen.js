/**
 * ProfileScreen — User profile and achievements
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { colors, typography, spacing, borderRadius } from '../../theme';
import SafeContainer from '../../components/common/SafeContainer';
import Avatar from '../../components/common/Avatar';

const ProfileScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <SafeContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Pressable
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Ionicons name="settings-outline" size={24} color={colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* User Info */}
        <Animated.View entering={FadeInUp.delay(100)} style={styles.userInfoContainer}>
          <Avatar name={user?.name || 'Guest'} source={user?.avatar} size={80} style={styles.avatar} />
          <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'guest@stridewellness.com'}</Text>
          <Pressable style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </Pressable>
        </Animated.View>

        {/* Lifetime Stats */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Lifetime Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>14</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>152k</Text>
              <Text style={styles.statLabel}>Total Steps</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>114</Text>
              <Text style={styles.statLabel}>Total km</Text>
            </View>
          </View>
        </Animated.View>

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
  settingsButton: {
    padding: spacing.xs,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  userInfoContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  avatar: {
    marginBottom: spacing.md,
  },
  userName: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    ...typography.bodySm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  editProfileButton: {
    backgroundColor: colors.cardBackground,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  editProfileText: {
    ...typography.buttonSm,
    color: colors.textPrimary,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  statsContainer: {
    marginTop: spacing.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.xl,
    padding: spacing.base,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.borderLight,
  },
  statValue: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
  },
});

import { layout } from '../../theme/spacing';

export default ProfileScreen;
