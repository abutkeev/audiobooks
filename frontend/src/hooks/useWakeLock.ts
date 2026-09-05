import { useEffect } from 'react';
import { useAppSelector } from '@/store';

export const wakeLockSupported = 'wakeLock' in navigator;

// mounted once in PlayerHost: a second instance would release the lock from under the first one
const useWakeLock = () => {
  const { preventScreenLock, playing } = useAppSelector(({ player: { state } }) => state);
  useEffect(() => {
    if (preventScreenLock && playing && wakeLockSupported) {
      let timerId: ReturnType<typeof setTimeout>;
      let wakelock: WakeLockSentinel;
      const preventLock = () =>
        navigator.wakeLock
          .request('screen')
          .then(lock => {
            wakelock = lock;
            wakelock.onrelease = () => {
              timerId = setTimeout(() => {
                clearTimeout(timerId);
                preventLock();
              }, 1000);
            };
          })
          // a hidden document refuses the lock, and playing now drops on a standstill too
          .catch(e => console.error("Can't prevent screen lock", e));
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
};

export default useWakeLock;
