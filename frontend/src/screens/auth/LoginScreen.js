/**
 * LoginScreen — "Start moving with Stride"
 * Matches the Stride concept login design.
 */

import React, { useState, useCallback, useRef } from 'react';
import {
 View, Text, ScrollView, StyleSheet, Pressable, KeyboardAvoidingView, Platform,
} from 'react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { loginRequest, guestLoginRequest, googleLoginRequest, clearAuthError } from '../../redux/slices/authSlice';
import { validateEmail, validatePassword } from '../../utils/validators';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const LoginScreen = ({ navigation }) => {
 const dispatch = useDispatch();
 const { isLoading, error } = useSelector((state) => state.auth);

 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [errors, setErrors] = useState({});
 const passwordRef = useRef(null);

  // Google login is now handled natively by handleGoogleLogin below

 const handleLogin = useCallback(() => {
  const emailError = validateEmail(email);
  const passwordError = password ? null : 'Password is required';

  if (emailError || passwordError) {
   setErrors({ email: emailError, password: passwordError });
   return;
  }

  setErrors({});
  dispatch(loginRequest({ email, password }));
 }, [email, password, dispatch]);

 const handleGuestLogin = useCallback(() => {
  dispatch(guestLoginRequest());
 }, [dispatch]);

 return (
  <KeyboardAvoidingView
   style={styles.container}
   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >
   <ScrollView
    contentContainerStyle={styles.scrollContent}
    keyboardShouldPersistTaps="handled"
    showsVerticalScrollIndicator={false}
   >
    {/* Header */}
    <Animated.View entering={FadeInUp.delay(100).duration(600)} style={styles.header}>
     <Text style={styles.title}>
      Start moving with{'\n'}
      <Text style={styles.titleAccent}>Stride</Text>
     </Text>
     <Text style={styles.subtitle}>
      Track your steps, set goals, and stay{'\n'}active every day
     </Text>
    </Animated.View>

    {/* Divider */}
    <Animated.View entering={FadeInUp.delay(300).duration(600)} style={styles.divider}>
     <View style={styles.dividerLine} />
     <Text style={styles.dividerText}>or sign in</Text>
     <View style={styles.dividerLine} />
    </Animated.View>

    {/* Email Login Form */}
    <Animated.View entering={FadeInUp.delay(400).duration(600)}>
     {error && (
      <View style={styles.errorBanner}>
       <Ionicons name="alert-circle" size={18} color={colors.error} />
       <Text style={styles.errorBannerText}>{error}</Text>
      </View>
     )}

     <Input
      label="Email"
      placeholder="your@email.com"
      value={email}
      onChangeText={(text) => {
       setEmail(text);
       if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
       if (error) dispatch(clearAuthError());
      }}
      icon="mail-outline"
      keyboardType="email-address"
      error={errors.email}
      returnKeyType="next"
      onSubmitEditing={() => passwordRef.current?.focus()}
     />

     <Input
      label="Password"
      placeholder="Enter your password"
      value={password}
      onChangeText={(text) => {
       setPassword(text);
       if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
      }}
      icon="lock-closed-outline"
      secureTextEntry
      error={errors.password}
      inputRef={passwordRef}
      returnKeyType="done"
      onSubmitEditing={handleLogin}
     />

     <Pressable
      onPress={() => navigation.navigate('ForgotPassword')}
      style={styles.forgotPassword}
     >
      <Text style={styles.forgotPasswordText}>Forgot password?</Text>
     </Pressable>

     <Button
      title="Sign In"
      onPress={handleLogin}
      variant="secondary"
      size="lg"
      fullWidth
      loading={isLoading}
      style={styles.signInButton}
     />
    </Animated.View>

    {/* Register Link */}
    <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.registerRow}>
     <Text style={styles.registerText}>Don't have an account? </Text>
     <Pressable onPress={() => navigation.navigate('Register')}>
      <Text style={styles.registerLink}>Sign Up</Text>
     </Pressable>
    </Animated.View>
   </ScrollView>
  </KeyboardAvoidingView>
 );
};

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: colors.background,
 },
 scrollContent: {
  flexGrow: 1,
  paddingHorizontal: spacing.xl,
  paddingTop: 80,
  paddingBottom: 40,
 },
 header: {
  marginBottom: spacing.xxl,
 },
 title: {
  ...typography.display,
  color: colors.textPrimary,
  lineHeight: 42,
 },
 titleAccent: {
  color: colors.primary,
 },
 subtitle: {
  ...typography.body,
  color: colors.textSecondary,
  marginTop: spacing.md,
  lineHeight: 24,
 },
 guestButton: {
  marginBottom: spacing.sm,
 },
 guestNote: {
  ...typography.caption,
  color: colors.textTertiary,
  textAlign: 'center',
  marginBottom: spacing.lg,
 },
 divider: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: spacing.xl,
 },
 dividerLine: {
  flex: 1,
  height: 1,
  backgroundColor: colors.border,
 },
 dividerText: {
  ...typography.caption,
  color: colors.textTertiary,
  marginHorizontal: spacing.md,
 },
 errorBanner: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: colors.errorMuted,
  borderRadius: borderRadius.md,
  padding: spacing.md,
  marginBottom: spacing.base,
  gap: spacing.sm,
 },
 errorBannerText: {
  ...typography.bodySm,
  color: colors.error,
  flex: 1,
 },
 forgotPassword: {
  alignSelf: 'flex-end',
  marginBottom: spacing.base,
  marginTop: -spacing.sm,
 },
 forgotPasswordText: {
  ...typography.caption,
  color: colors.primary,
 },
 signInButton: {
  marginBottom: spacing.xl,
 },
 registerRow: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
 },
 registerText: {
  ...typography.bodySm,
  color: colors.textSecondary,
 },
 registerLink: {
  ...typography.bodyMedium,
  color: colors.primary,
  fontSize: 14,
 },
});

export default LoginScreen;
