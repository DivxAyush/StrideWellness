/**
 * Avatar — User avatar with image support and fallback initials.
 */

import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { colors, typography, borderRadius } from '../../theme';

const Avatar = ({
  source,
  name,
  size = 44,
  style,
}) => {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  const fontSize = size * 0.38;

  if (source) {
    return (
      <Image
        source={typeof source === 'string' ? { uri: source } : source}
        style={[
          styles.image,
          { width: size, height: size, borderRadius: size / 2 },
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        { width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
    >
      <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  fallback: {
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  initials: {
    color: colors.primary,
    fontFamily: 'Inter_600SemiBold',
  },
});

export default Avatar;
