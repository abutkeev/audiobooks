import { useEffect } from 'react';

interface PositionInfo {
  position: number;
  duration?: number;
  playbackRate: number;
}
const usePositionState = ({ position, duration, playbackRate }: PositionInfo) => {
  const { mediaSession } = navigator;

  useEffect(() => {
    if (duration && position <= duration) {
      mediaSession.setPositionState({ duration, position, playbackRate });
    }
    return () => {
      mediaSession.setPositionState();
    };
  }, [duration, position, playbackRate, mediaSession]);
};

export default usePositionState;
