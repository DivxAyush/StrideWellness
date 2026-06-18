import { useState, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import ExpoActivityRecognition from 'expo-activity-recognition';
import { updateLiveSteps, updateHourlyData } from '../redux/slices/activitySlice';
import { activityService } from '../services/dataService';

export const usePedometer = () => {
 const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
 const [permissionGranted, setPermissionGranted] = useState(false);
 const dispatch = useDispatch();

 const { dailySteps, goalSteps } = useSelector((state) => state.activity);
 const dailyStepsRef = useRef(dailySteps || 0);
 const currentSessionStepsRef = useRef(0);
 const lastSyncedStepsRef = useRef(0);
 const currentActivityRef = useRef('unknown');
 const hourlyDataRef = useRef(Array(24).fill(0));

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
     const baseSteps = localStepsStr ? parseInt(localStepsStr, 10) : 0;
     dailyStepsRef.current = baseSteps;

     const hourlyDataStr = await AsyncStorage.getItem(`hourly_steps_${todayStr}`);
     if (hourlyDataStr) {
       hourlyDataRef.current = JSON.parse(hourlyDataStr);
     } else {
       hourlyDataRef.current = Array(24).fill(0);
       // Distribute baseSteps realistically across previous hours so graph looks correct
       if (baseSteps > 0) {
         const currentHour = new Date().getHours();
         const startHour = Math.max(0, currentHour - 8); // Spread over last 8 hours max
         const hoursToFill = currentHour - startHour + 1;
         const stepsPerHour = Math.floor(baseSteps / hoursToFill);
         const remainder = baseSteps % hoursToFill;
         
         for (let i = startHour; i <= currentHour; i++) {
           hourlyDataRef.current[i] = stepsPerHour + (i === currentHour ? remainder : 0);
         }
       }
       AsyncStorage.setItem(`hourly_steps_${todayStr}`, JSON.stringify(hourlyDataRef.current));
     }
     dispatch(updateHourlyData([...hourlyDataRef.current]));

     dispatch(updateLiveSteps(baseSteps));
     lastSyncedStepsRef.current = baseSteps;

     // Setup Notifee Foreground Service Notification
     // await notifee.requestPermission();
     // const channelId = await notifee.createChannel({
     //   id: 'step_counter',
     //   name: 'Step Counter',
     //   importance: AndroidImportance.LOW,
     // });

     let lastNotifiedSteps = 0;
     const targetSteps = goalSteps || 10000;
     
     // Save goal for background task
     await AsyncStorage.setItem('goalSteps', targetSteps.toString());

     const updateNotification = async (steps) => {
       // Throttle notification updates so it doesn't spam the OS (update every 5 steps)
       if (steps - lastNotifiedSteps < 5 && lastNotifiedSteps !== 0) return;
       lastNotifiedSteps = steps;

       // try {
       //   await notifee.displayNotification({
       //     id: 'step_counter_notification',
       //     title: '👟 Stride Wellness is Active',
       //     body: `You have taken ${steps} / ${targetSteps} steps today!`,
       //     android: {
       //       channelId,
       //       asForegroundService: true,
       //       color: '#3B82F6',
       //       colorized: true,
       //       ongoing: true,
       //       progress: {
       //         max: targetSteps,
       //         current: steps,
       //       },
       //       smallIcon: 'ic_launcher',
       //       pressAction: {
       //         id: 'default',
       //       },
       //     },
       //   });
       // } catch (e) {
       //   console.log('Notifee error:', e);
       // }
     };

     // Initial Notification
     updateNotification(baseSteps);

     // Setup Activity Recognition
     // try {
     //   const actPerm = await ExpoActivityRecognition.requestPermissions();
     //   if (actPerm.granted) {
     //     await ExpoActivityRecognition.setupObserver(10000);
     //     ExpoActivityRecognition.addListener('onActivityChange', ({ activity }) => {
     //       console.log(`Activity changed: ${activity}`);
     //       currentActivityRef.current = activity;
     //     });
     //   }
     // } catch (e) {
     //   console.log('Activity recognition setup error', e);
     // }

     let lastHardwareSteps = null;

     subscription = Pedometer.watchStepCount((result) => {
      if (lastHardwareSteps === null) {
       lastHardwareSteps = result.steps;
       return;
      }

      const hardwareStepsDelta = result.steps - lastHardwareSteps;
      lastHardwareSteps = result.steps;

      // Skip tracking if cycling or driving
      if (currentActivityRef.current === 'cycling' || currentActivityRef.current === 'driving') {
        return;
      }

      currentSessionStepsRef.current += hardwareStepsDelta;
      const newTotal = dailyStepsRef.current + currentSessionStepsRef.current;

      dispatch(updateLiveSteps(newTotal));
      AsyncStorage.setItem(`steps_${todayStr}`, newTotal.toString());

      const currentHour = new Date().getHours();
      hourlyDataRef.current[currentHour] += hardwareStepsDelta;
      dispatch(updateHourlyData([...hourlyDataRef.current]));
      AsyncStorage.setItem(`hourly_steps_${todayStr}`, JSON.stringify(hourlyDataRef.current));

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
