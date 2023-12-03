import { useEffect } from 'react';

interface PositionInfo {
  position: number;
  duration?: number;
}
const usePositionState = ({ position, duration }: PositionInfo) => {
  const { mediaSession } = navigator;

  useEffect(() => {
    if (duration && position <= duration) {
      mediaSession.setPositionState({ duration, position });
    }
    return () => {
      mediaSession.setPositionState();
    };
  }, [duration, position, mediaSession]);
};

export default usePositionState;
