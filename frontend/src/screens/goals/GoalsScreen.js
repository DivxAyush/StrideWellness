/**
 * GoalsScreen — Manage step, water, and weight goals
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Modal, TextInput, RefreshControl } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import SafeContainer from '../../components/common/SafeContainer';
import ProgressRing from '../../components/common/ProgressRing';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGoalsRequest, updateGoalRequest, createGoalRequest } from '../../redux/slices/goalsSlice';

const GoalCard = ({ title, current, target, unit, icon, color, delay, onPress }) => {
  const progress = target > 0 ? Math.min((current / target) * 100, 100) : 0;

  return (
    <Animated.View entering={FadeInUp.delay(delay)}>
      <Pressable style={styles.goalCard} onPress={onPress}>
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
      </Pressable>
    </Animated.View>
  );
};

const GoalsScreen = () => {
  const dispatch = useDispatch();
  const { goals } = useSelector(state => state.goals);
  const { dailySteps, liveSteps } = useSelector(state => state.activity);
  const { currentIntake } = useSelector(state => state.water);
  
  const currentSteps = liveSteps || dailySteps || 0;
  
  // Find specific goals
  const stepGoal = goals.find(g => g.type === 'steps') || { target: 10000 };
  const waterGoal = goals.find(g => g.type === 'water') || { target: 4.0 };
  const weightGoal = goals.find(g => g.type === 'weight') || { target: 70 };

  const [modalVisible, setModalVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchGoalsRequest());
  }, [dispatch]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(fetchGoalsRequest());
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, [dispatch]);

  const openEditModal = (type, currentTarget) => {
    setEditingGoal(type);
    setTempValue(currentTarget.toString());
    setModalVisible(true);
  };

  const handleSaveGoal = () => {
    const targetValue = parseFloat(tempValue);
    if (isNaN(targetValue) || targetValue <= 0) return;

    const existingGoal = goals.find(g => g.type === editingGoal);
    
    if (existingGoal) {
      dispatch(updateGoalRequest({ id: existingGoal._id, data: { target: targetValue } }));
    } else {
      let title, unit, icon, color;
      if (editingGoal === 'steps') {
        title = 'Daily Steps'; unit = 'steps'; icon = 'walk'; color = '#3B82F6';
      } else if (editingGoal === 'water') {
        title = 'Hydration'; unit = 'L'; icon = 'water'; color = '#0ea5e9';
      } else if (editingGoal === 'weight') {
        title = 'Target Weight'; unit = 'kg'; icon = 'barbell'; color = '#F59E0B';
      }
      dispatch(createGoalRequest({ 
        type: editingGoal, target: targetValue, title, unit, icon, color 
      }));
    }
    setModalVisible(false);
  };

  return (
    <SafeContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Goals</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={colors.primary} 
            colors={[colors.primary]} 
          />
        }
      >
        <Animated.View entering={FadeInDown.delay(100)}>
          <Text style={styles.sectionTitle}>Daily Goals</Text>
        </Animated.View>

        <GoalCard
          title="Daily Steps"
          current={currentSteps}
          target={stepGoal.target}
          unit="steps"
          icon="walk"
          color={colors.primary}
          delay={200}
          onPress={() => openEditModal('steps', stepGoal.target)}
        />

        <GoalCard
          title="Hydration"
          current={(currentIntake / 1000).toFixed(1)}
          target={waterGoal.target}
          unit="L"
          icon="water"
          color={colors.secondaryAccent}
          delay={300}
          onPress={() => openEditModal('water', waterGoal.target)}
        />

        <Animated.View entering={FadeInDown.delay(400)} style={{ marginTop: spacing.xl }}>
          <Text style={styles.sectionTitle}>Long-term Goals</Text>
        </Animated.View>

        <GoalCard
          title="Target Weight"
          current={75} // Mock current weight
          target={weightGoal.target}
          unit="kg"
          icon="barbell"
          color={colors.warning}
          delay={500}
          onPress={() => openEditModal('weight', weightGoal.target)}
        />
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Update {editingGoal === 'steps' ? 'Step Goal' : editingGoal === 'water' ? 'Hydration Goal' : 'Target Weight'}
            </Text>
            <Input
              value={tempValue}
              onChangeText={setTempValue}
              keyboardType="numeric"
              placeholder="Enter target"
            />
            <View style={styles.modalActions}>
              <Button title="Cancel" variant="outline" onPress={() => setModalVisible(false)} style={{ flex: 1, marginRight: spacing.sm }} />
              <Button title="Save" onPress={handleSaveGoal} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: spacing.lg,
  },
});

export default GoalsScreen;
