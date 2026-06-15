import { useState, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateLiveSteps } from '../redux/slices/activitySlice';
import { activityService } from '../services/dataService';

export const usePedometer = () => {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [permissionGranted, setPermissionGranted] = useState(false);
  const dispatch = useDispatch();

  const { dailySteps } = useSelector((state) => state.activity);
  const dailyStepsRef = useRef(dailySteps || 0);
  const currentSessionStepsRef = useRef(0);
  const lastSyncedStepsRef = useRef(0);

  // Keep ref updated to avoid stale closures
  useEffect(() => {
    if (dailySteps > dailyStepsRef.current) {
      dailyStepsRef.current = dailySteps;
    }
  }, [dailySteps]);

  useEffect(() => {
    let subscription;
    let appStateSubscription;

    let isSyncing = false;
    const syncToDB = async (totalSteps) => {
      if (isSyncing || totalSteps <= lastSyncedStepsRef.current) return;
      
      isSyncing = true;
      try {
        const date = new Date().toISOString();
        // Assume rough distance/calories based on steps
        const distance = parseFloat(((totalSteps * 0.762) / 1000).toFixed(2)); // ~0.762m per step
        const calories = Math.round(totalSteps * 0.04); // ~0.04 kcal per step
        
        await activityService.logActivity({
          date,
          steps: totalSteps,
          distance,
          calories
        });
        lastSyncedStepsRef.current = totalSteps;
      } catch (err) {
        console.error('Failed to sync steps to DB:', err);
      } finally {
        isSyncing = false;
      }
    };

    const subscribe = async () => {
      try {
        const { status } = await Pedometer.requestPermissionsAsync();
        if (status === 'granted') {
          setPermissionGranted(true);
        } else {
          setIsPedometerAvailable('permission_denied');
          return;
        }

        const isAvailable = await Pedometer.isAvailableAsync();
        setIsPedometerAvailable(String(isAvailable));

        if (isAvailable) {
          // Load any locally saved base steps for today if app crashed
          const todayStr = new Date().toISOString().split('T')[0];
          const localStepsStr = await AsyncStorage.getItem(`steps_${todayStr}`);
          const localSteps = localStepsStr ? parseInt(localStepsStr, 10) : 0;
          
          // Max of backend dailySteps or localSteps
          const baseSteps = Math.max(dailyStepsRef.current, localSteps);
          dailyStepsRef.current = baseSteps;
          lastSyncedStepsRef.current = baseSteps;

          subscription = Pedometer.watchStepCount((result) => {
            currentSessionStepsRef.current = result.steps;
            const newTotal = dailyStepsRef.current + result.steps;
            
            // Update Redux UI
            dispatch(updateLiveSteps(newTotal));
            
            // Save to local storage fast
            AsyncStorage.setItem(`steps_${todayStr}`, newTotal.toString());

            // Throttle DB sync to every 50 steps
            if (newTotal - lastSyncedStepsRef.current >= 50) {
              syncToDB(newTotal);
            }
          });
        }
      } catch (error) {
        setIsPedometerAvailable('error');
        console.error('Pedometer subscription error:', error);
      }
    };

    subscribe();

    // Sync on app backgrounding
    appStateSubscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState.match(/inactive|background/)) {
        const total = dailyStepsRef.current + currentSessionStepsRef.current;
        syncToDB(total);
      }
    });

    return () => {
      if (subscription && subscription.remove) subscription.remove();
      if (appStateSubscription && appStateSubscription.remove) appStateSubscription.remove();
      // Final sync on unmount
      const total = dailyStepsRef.current + currentSessionStepsRef.current;
      syncToDB(total);
    };
  }, [dispatch]);

  return {
    isPedometerAvailable,
    permissionGranted,
  };
};

export default usePedometer;
