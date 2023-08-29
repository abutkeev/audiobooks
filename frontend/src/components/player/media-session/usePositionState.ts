import { useEffect } from 'react';

interface PositionInfo {
  position: number;
  duration?: number;
}
const usePositionState = ({ position, duration }: PositionInfo) => {
  const { mediaSession } = navigator;

  useEffect(() => {
    if (duration) {
      mediaSession.setPositionState({ duration, position });
    }
    return () => {
      mediaSession.setPositionState();
    };
  }, [duration, position]);
};

export default usePositionState;
