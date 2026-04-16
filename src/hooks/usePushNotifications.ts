import { useState } from 'react';

const PUSH_KEY = 'tarot_push_subscribed';

export function usePushNotifications() {
  const [subscribed, setSubscribed] = useState<boolean>(
    () => localStorage.getItem(PUSH_KEY) === 'true'
  );

  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) return false;
    const result = await Notification.requestPermission();
    const granted = result === 'granted';
    if (granted) {
      localStorage.setItem(PUSH_KEY, 'true');
      setSubscribed(true);
    }
    return granted;
  };

  return { subscribed, requestPermission };
}
