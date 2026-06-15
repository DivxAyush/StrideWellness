/**
 * ProfileScreen — User profile and achievements
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { colors, typography, spacing, borderRadius } from '../../theme';
import SafeContainer from '../../components/common/SafeContainer';
import Avatar from '../../components/common/Avatar';
import { fetchYearlyActivityRequest } from '../../redux/slices/activitySlice';
import { fetchOverallWaterRequest } from '../../redux/slices/waterSlice';

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { yearlyData, goalSteps } = useSelector((state) => state.activity);
  const { overallData, dailyGoal: waterGoal } = useSelector((state) => state.water);

  React.useEffect(() => {
    dispatch(fetchYearlyActivityRequest());
    dispatch(fetchOverallWaterRequest());
  }, [dispatch]);

  const stats = React.useMemo(() => {
    let totalSteps = 0;
    let totalKm = 0;
    
    const activityMap = {};
    if (yearlyData && yearlyData.length > 0) {
      yearlyData.forEach(day => {
        totalSteps += day.steps || 0;
        totalKm += day.distance || 0;
        
        const dateStr = new Date(day.date).toISOString().split('T')[0];
        activityMap[dateStr] = day;
      });
    }

    const waterMap = {};
    if (overallData && overallData.length > 0) {
      overallData.forEach(day => {
        const dateStr = new Date(day.date).toISOString().split('T')[0];
        waterMap[dateStr] = day;
      });
    }

    let streak = 0;
    let today = new Date();
    today.setHours(0,0,0,0);

    // Check backwards day by day, starting from today
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];

      const aDay = activityMap[dateStr];
      const wDay = waterMap[dateStr];

      const stepTarget = goalSteps || 10000;
      const waterTarget = waterGoal || 4000;

      const stepsDone = aDay ? (aDay.steps || 0) : 0;
      const waterDone = wDay ? (wDay.totalIntake || 0) : 0;

      if (stepsDone >= stepTarget && waterDone >= waterTarget) {
        streak++;
      } else {
        // If it's today, we don't break the streak if it's not completed YET, 
        // we just don't count it and look at yesterday.
        if (i !== 0) {
          break; // Break on any past day that wasn't completed
        }
      }
    }

    // Format numbers nicely
    const formatNum = (num) => {
      if (num > 1000) return (num / 1000).toFixed(1) + 'k';
      return num.toString();
    };

    return {
      streak,
      steps: formatNum(totalSteps),
      km: totalKm.toFixed(1)
    };
  }, [yearlyData, overallData, goalSteps, waterGoal]);

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
              <Text style={styles.statValue}>{stats.streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{stats.steps}</Text>
              <Text style={styles.statLabel}>Total Steps</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{stats.km}</Text>
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
