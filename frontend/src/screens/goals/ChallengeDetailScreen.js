import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSelector, useDispatch } from 'react-redux';
import { checkInChallengeDay, deleteChallenge } from '../../redux/slices/challengesSlice';

import { colors, typography, spacing, borderRadius } from '../../theme';
import SafeContainer from '../../components/common/SafeContainer';
import Button from '../../components/common/Button';

const ChallengeDetailScreen = ({ route, navigation }) => {
  const { challengeId } = route.params;
  const dispatch = useDispatch();
  
  const challenge = useSelector(state => 
    state.challenges.challenges.find(c => c.id === challengeId)
  );

  const scale = useSharedValue(1);

  if (!challenge) {
    return (
      <SafeContainer>
        <View style={styles.center}>
          <Text style={{ color: colors.textSecondary }}>Challenge not found.</Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} style={{ marginTop: spacing.md }} />
        </View>
      </SafeContainer>
    );
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const isCompletedToday = challenge.completedDates.includes(todayStr);

  const handleCheckIn = () => {
    if (isCompletedToday) return;

    // Haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Animation
    scale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withSpring(1.1, { damping: 4, stiffness: 200 }),
      withSpring(1)
    );

    dispatch(checkInChallengeDay(challengeId, todayStr));
  };

  const handleDelete = () => {
    dispatch(deleteChallenge(challengeId));
    navigation.goBack();
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });

  return (
    <SafeContainer>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>{challenge.title}</Text>
        <Pressable onPress={handleDelete} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.delay(100)} style={styles.progressCard}>
          <Text style={styles.progressTitle}>{challenge.completedDates.length} of {challenge.totalDays} Days</Text>
          <Text style={styles.progressSub}>Keep up the momentum!</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200)} style={styles.gridContainer}>
          {Array.from({ length: challenge.totalDays }).map((_, index) => {
            // Very simple logic: first N circles are checked if N days are completed
            // If the user wants specific dates mapped, we can map them, but a simple habit streak fills up left-to-right
            const isDone = index < challenge.completedDates.length;
            return (
              <View 
                key={index} 
                style={[
                  styles.dayCircle,
                  isDone && styles.dayCircleDone
                ]}
              >
                {isDone ? (
                  <Ionicons name="checkmark" size={14} color={colors.cardBackground} />
                ) : (
                  <Text style={styles.dayText}>{index + 1}</Text>
                )}
              </View>
            );
          })}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300)} style={styles.actionContainer}>
          <Animated.View style={buttonAnimatedStyle}>
            <Button 
              title={isCompletedToday ? "Completed Today! 🎉" : "Mark Today as Done"} 
              onPress={handleCheckIn}
              disabled={isCompletedToday}
              style={[styles.checkInButton, isCompletedToday && styles.checkInButtonDone]}
            />
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    justifyContent: 'space-between',
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
  },
  deleteButton: {
    padding: spacing.sm,
  },
  content: {
    paddingVertical: spacing.lg,
    paddingBottom: 60,
  },
  progressCard: {
    backgroundColor: colors.cardBackground,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  progressTitle: {
    ...typography.h2,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  progressSub: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.cardBackground,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.xl,
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  dayCircleDone: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  dayText: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  actionContainer: {
    marginTop: spacing.md,
  },
  checkInButton: {
    paddingVertical: spacing.lg,
  },
  checkInButtonDone: {
    backgroundColor: colors.success,
  }
});

export default ChallengeDetailScreen;
