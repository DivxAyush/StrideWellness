/**
 * TabSelector — Horizontal tab selector with animated indicator.
 * Used for Today/Week/Month/Year tabs.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnUI,
} from 'react-native-reanimated';
import { colors, typography, borderRadius, spacing } from '../../theme';

const TabSelector = ({
  tabs = [],
  activeTab = 0,
  onTabChange,
  style,
}) => {
  const [tabWidths, setTabWidths] = useState({});
  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: indicatorWidth.value,
  }));

  const handleTabLayout = useCallback((index, event) => {
    const { x, width } = event.nativeEvent.layout;
    setTabWidths((prev) => ({ ...prev, [index]: { x, width } }));
    if (index === activeTab) {
      indicatorX.value = x;
      indicatorWidth.value = width;
    }
  }, [activeTab]);

  const handleTabPress = useCallback((index) => {
    const tabLayout = tabWidths[index];
    if (tabLayout) {
      indicatorX.value = withSpring(tabLayout.x, { damping: 20, stiffness: 200 });
      indicatorWidth.value = withSpring(tabLayout.width, { damping: 20, stiffness: 200 });
    }
    onTabChange?.(index);
  }, [tabWidths, onTabChange]);

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.indicator, indicatorStyle]} />
      {tabs.map((tab, index) => (
        <Pressable
          key={tab}
          onPress={() => handleTabPress(index)}
          onLayout={(e) => handleTabLayout(index, e)}
          style={styles.tab}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === index && styles.tabTextActive,
            ]}
          >
            {tab}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.xxs,
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: spacing.xxs,
    bottom: spacing.xxs,
    backgroundColor: colors.secondaryBackground,
    borderRadius: borderRadius.md,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    ...typography.tab,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.textPrimary,
  },
});

export default TabSelector;
