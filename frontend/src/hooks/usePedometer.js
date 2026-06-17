import { useState, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { updateLiveSteps } from '../redux/slices/activitySlice';
import { activityService } from '../services/dataService';

export const usePedometer = () => {
 const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
 const [permissionGranted, setPermissionGranted] = useState(false);
 const dispatch = useDispatch();

 const { dailySteps, goalSteps } = useSelector((state) => state.activity);
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
    const distance = parseFloat(((totalSteps * 0.762) / 1000).toFixed(2));
    const calories = Math.round(totalSteps * 0.04);

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
     const todayStr = new Date().toISOString().split('T')[0];
     const localStepsStr = await AsyncStorage.getItem(`steps_${todayStr}`);
     const localSteps = localStepsStr ? parseInt(localStepsStr, 10) : 0;

     const baseSteps = Math.max(dailyStepsRef.current, localSteps);
     dailyStepsRef.current = baseSteps;
     lastSyncedStepsRef.current = baseSteps;

     // Setup Notifee Foreground Service Notification
     await notifee.requestPermission();
     const channelId = await notifee.createChannel({
       id: 'step_counter',
       name: 'Step Counter',
       importance: AndroidImportance.LOW,
     });

     let lastNotifiedSteps = 0;
     const targetSteps = goalSteps || 10000;
     
     // Save goal for background task
     await AsyncStorage.setItem('goalSteps', targetSteps.toString());

     const updateNotification = async (steps) => {
       // Throttle notification updates so it doesn't spam the OS (update every 5 steps)
       if (steps - lastNotifiedSteps < 5 && lastNotifiedSteps !== 0) return;
       lastNotifiedSteps = steps;

       try {
         await notifee.displayNotification({
           id: 'step_counter_notification',
           title: '👟 Stride Wellness is Active',
           body: `You have taken ${steps} / ${targetSteps} steps today!`,
           android: {
             channelId,
             asForegroundService: true,
             color: '#3B82F6',
             colorized: true,
             ongoing: true,
             progress: {
               max: targetSteps,
               current: steps,
             },
             smallIcon: 'ic_launcher',
             pressAction: {
               id: 'default',
             },
           },
         });
       } catch (e) {
         console.log('Notifee error:', e);
       }
     };

     // Initial Notification
     updateNotification(baseSteps);

     let initialOffset = null;

     subscription = Pedometer.watchStepCount((result) => {
      if (initialOffset === null) {
       initialOffset = result.steps;
      }

      const actualSessionSteps = result.steps - initialOffset;
      currentSessionStepsRef.current = actualSessionSteps;

      const newTotal = dailyStepsRef.current + actualSessionSteps;

      dispatch(updateLiveSteps(newTotal));
      AsyncStorage.setItem(`steps_${todayStr}`, newTotal.toString());

      // Update Foreground Service Notification
      updateNotification(newTotal);

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

  appStateSubscription = AppState.addEventListener('change', nextAppState => {
   if (nextAppState.match(/inactive|background/)) {
    const total = dailyStepsRef.current + currentSessionStepsRef.current;
    syncToDB(total);
   }
  });

  return () => {
   if (subscription && subscription.remove) subscription.remove();
   if (appStateSubscription && appStateSubscription.remove) appStateSubscription.remove();
   // Not stopping Foreground service on unmount so it keeps tracking in background!
   const total = dailyStepsRef.current + currentSessionStepsRef.current;
   syncToDB(total);
  };
 }, [dispatch, goalSteps]);

 return {
  isPedometerAvailable,
  permissionGranted,
 };
};

export default usePedometer;
