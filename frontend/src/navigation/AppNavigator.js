/**
 * App Navigator — Root navigation handling authentication state
 */

import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';

import SplashScreen from '../screens/splash/SplashScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import SettingsScreen from '../screens/settings/SettingsScreen';
import { storageService } from '../services/storageService';
import { restoreSessionRequest } from '../redux/slices/authSlice';
import { colors } from '../theme';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isRestoringSession } = useSelector((state) => state.auth);
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const checkState = async () => {
      // 1. Check onboarding
      const onboardingComplete = await storageService.isOnboardingComplete();
      setShowOnboarding(!onboardingComplete);
      
      // 2. Restore session
      dispatch(restoreSessionRequest());
    };

    checkState();
  }, [dispatch]);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleOnboardingComplete = async () => {
    await storageService.setOnboardingComplete();
    setShowOnboarding(false);
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // We show onboarding if it's not completed, regardless of auth state
  // But wait until session restoration finishes so we don't flash login if they are authenticated
  if (isRestoringSession && !showOnboarding) {
    return null; // Return empty view or keep splash visible
  }

  return (
    <NavigationContainer theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.background } }}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {showOnboarding ? (
          <Stack.Screen name="Onboarding">
            {(props) => <OnboardingScreen {...props} onComplete={handleOnboardingComplete} />}
          </Stack.Screen>
        ) : !isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <Stack.Group>
            <Stack.Screen name="Main" component={MainNavigator} />
            <Stack.Screen 
              name="Settings" 
              component={SettingsScreen} 
              options={{ animation: 'slide_from_right' }}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
