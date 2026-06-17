import { registerRootComponent } from 'expo';
import notifee from '@notifee/react-native';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import App from './App';

// Register background task for Notifee to keep the app alive and track steps
notifee.registerForegroundService(() => {
 return new Promise((resolve) => {
  let subscription;
  let initialOffset = null;
  let baseSteps = 0;
  let targetSteps = 10000;

  const setupBackgroundTracking = async () => {
   try {
    const todayStr = new Date().toISOString().split('T')[0];
    const localStepsStr = await AsyncStorage.getItem(`steps_${todayStr}`);
    const goalStepsStr = await AsyncStorage.getItem('goalSteps');

    baseSteps = localStepsStr ? parseInt(localStepsStr, 10) : 0;
    targetSteps = goalStepsStr ? parseInt(goalStepsStr, 10) : 10000;

    let lastNotifiedSteps = 0;

    subscription = Pedometer.watchStepCount(async (result) => {
     if (initialOffset === null) initialOffset = result.steps;
     const actualSessionSteps = result.steps - initialOffset;
     const newTotal = baseSteps + actualSessionSteps;

     await AsyncStorage.setItem(`steps_${todayStr}`, newTotal.toString());

     // Throttle to 5 steps to save battery and avoid spamming notification channel
     if (newTotal - lastNotifiedSteps < 5 && lastNotifiedSteps !== 0) return;
     lastNotifiedSteps = newTotal;

     // Update Notification
     await notifee.displayNotification({
      id: 'step_counter_notification',
      title: '👟 Stride Wellness is Active',
      body: `Background: ${newTotal} / ${targetSteps} steps`,
      android: {
       channelId: 'step_counter',
       asForegroundService: true,
       color: '#3B82F6',
       ongoing: true,
       onlyAlertOnce: true,
       progress: {
        max: targetSteps,
        current: newTotal,
       },
      },
     });
    });
   } catch (e) {
    console.log('Background Pedometer error:', e);
   }
  };

  setupBackgroundTracking();

  // Listen for task cancellation
  notifee.onBackgroundEvent(async ({ type }) => {
   if (type === 3) { // 3 is EventType.DISMISSED or similar stopping event
    if (subscription && subscription.remove) subscription.remove();
    resolve();
   }
  });
 });
});

registerRootComponent(App);
