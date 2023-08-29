import { useEffect } from 'react';

interface WakeLockParams {
  preventScreenLock: boolean;
  playing: boolean;
}

const useWakeLock = ({ preventScreenLock, playing }: WakeLockParams) => {
  const wakelockAvailable = 'wakeLock' in navigator;
  useEffect(() => {
    if (preventScreenLock && playing && wakelockAvailable) {
      let timerId: ReturnType<typeof setTimeout>;
      let wakelock: WakeLockSentinel;
      const preventLock = () =>
        navigator.wakeLock.request('screen').then(lock => {
          wakelock = lock;
          wakelock.onrelease = () => {
            timerId = setTimeout(() => {
              console.log('timeout');
              clearTimeout(timerId);
              preventLock();
            }, 1000);
          };
        });
      preventLock();
      return () => {
        clearTimeout(timerId);
        if (wakelock) {
          wakelock.onrelease = null;
          wakelock.release();
        }
      };
    }
  }, [preventScreenLock, playing]);
  return wakelockAvailable;
};

export default useWakeLock;
