import { useEffect } from 'react';
import { useAppSelector } from '../store';

const useWakeLock = () => {
  const { preventScreenLock, playing } = useAppSelector(({ player: { state } }) => state);
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
