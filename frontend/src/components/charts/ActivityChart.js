/**
 * ActivityChart — Animated area chart using react-native-gifted-charts.
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { colors, spacing, borderRadius } from '../../theme';

const { width } = Dimensions.get('window');

const ActivityChart = ({ data = [], delay = 0 }) => {
  // Format data for Gifted Charts
  const chartData = useMemo(() => {
    // Check if we received the hourly array of length 24
    if (data && data.length === 24) {
      const formatted = data.map((steps, index) => {
        let timeLabel = '';
        if (index === 0) timeLabel = '12 AM';
        else if (index === 6) timeLabel = '6 AM';
        else if (index === 12) timeLabel = '12 PM';
        else if (index === 18) timeLabel = '6 PM';
        else if (index === 23) timeLabel = '11 PM';
        
        return { value: steps, label: timeLabel };
      });
      // Optionally trim future hours that are 0 to make the graph look better
      const currentHour = new Date().getHours();
      // Even if we trim, we need at least 2 points to draw a line
      const activeData = formatted.slice(0, Math.max(currentHour + 1, 2));
      return activeData;
    }

    if (!data || data.length === 0) {
      // Mock data for the concept design if none provided
      return [
        { value: 10, label: '00:00 AM' },
        { value: 15 },
        { value: 30 },
        { value: 80 },
        { value: 120 },
        { value: 180 },
        { value: 150 },
        { value: 90 },
        { value: 60 },
        { value: 110 },
        { value: 170 },
        { value: 200, label: '09:30 PM' },
      ];
    }
    return data;
  }, [data]);

  const chartWidth = width - spacing.xl * 2 - spacing.base * 2 - 20;

  return (
    <Animated.View
      entering={FadeInUp.delay(delay).duration(600).springify()}
      style={styles.container}
    >
      <View style={styles.chartWrapper}>
        <LineChart
          data={chartData}
          width={chartWidth}
          height={120}
          hideRules
          hideYAxisText
          hideAxesAndRules
          color={colors.primary}
          thickness={3}
          startFillColor="rgba(74, 222, 128, 0.4)"
          endFillColor="rgba(74, 222, 128, 0.0)"
          startOpacity={1}
          endOpacity={0.1}
          areaChart
          curved
          isAnimated
          animationDuration={1200}
          initialSpacing={10}
          spacing={(chartWidth - 20) / (chartData.length - 1 || 1)}
          dataPointsRadius={0}
          showVerticalLines={false}
          xAxisLabelTextStyle={styles.axisLabel}
          yAxisTextStyle={styles.axisLabel}
          pointerConfig={{
            pointerStripHeight: 120,
            pointerStripColor: colors.primary,
            pointerStripWidth: 1,
            pointerColor: colors.primary,
            radius: 4,
            pointerLabelWidth: 50,
            pointerLabelHeight: 30,
            activatePointersOnLongPress: false,
            autoAdjustPointerLabelPosition: true,
          }}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    marginTop: spacing.md,
  },
  chartWrapper: {
    alignItems: 'center',
    marginLeft: -10, // Adjust for chart padding
  },
  axisLabel: {
    color: colors.textTertiary,
    fontSize: 10,
  },
});

export default ActivityChart;
