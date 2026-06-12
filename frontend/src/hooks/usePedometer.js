import { useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';
import { useDispatch } from 'react-redux';
import { updateLiveSteps } from '../redux/slices/activitySlice';

export const usePedometer = () => {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [permissionGranted, setPermissionGranted] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    let subscription;

    const subscribe = async () => {
      try {
        // 1. Request permissions first
        const { status } = await Pedometer.requestPermissionsAsync();
        if (status === 'granted') {
          setPermissionGranted(true);
        } else {
          setIsPedometerAvailable('permission_denied');
          return;
        }

        // 2. Check availability
        const isAvailable = await Pedometer.isAvailableAsync();
        setIsPedometerAvailable(String(isAvailable));

        if (isAvailable) {
          // 3. Start live tracking
          subscription = Pedometer.watchStepCount((result) => {
            dispatch(updateLiveSteps(result.steps));
          });
        }
      } catch (error) {
        setIsPedometerAvailable('error');
        console.error('Pedometer subscription error:', error);
      }
    };

    subscribe();

    return () => {
      if (subscription && subscription.remove) {
        subscription.remove();
      }
    };
  }, [dispatch]);

  return {
    isPedometerAvailable,
    permissionGranted,
  };
};

export default usePedometer;
