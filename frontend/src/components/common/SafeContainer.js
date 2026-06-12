/**
 * SafeContainer — Screen wrapper with safe area handling.
 * Handles Dynamic Island, notches, and different screen sizes.
 */

import React from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, layout } from '../../theme';

const SafeContainer = ({
  children,
  style,
  edges = ['top', 'left', 'right'],
  noPaddingH = false,
  backgroundColor = colors.background,
}) => {
  return (
    <SafeAreaView
      edges={edges}
      style={[styles.container, { backgroundColor }, style]}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={[styles.content, !noPaddingH && styles.paddingH]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  paddingH: {
    paddingHorizontal: layout.screenPaddingH,
  },
});

export default SafeContainer;
