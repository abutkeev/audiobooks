import { useEffect } from 'react';

interface PositionInfo {
  bookId: string;
  position: number;
  duration?: number;
  playbackRate: number;
}
const usePositionState = ({ bookId, position, duration, playbackRate }: PositionInfo) => {
  const { mediaSession } = navigator;

  useEffect(() => {
    if (duration && isFinite(duration) && position <= duration) {
      mediaSession.setPositionState({ duration, position, playbackRate });
    }
  }, [duration, position, playbackRate, mediaSession]);

  // a reset on every position change flickers the lock screen controls, while a new book
  // must not keep the old progress, see docs/ai/frontend/player.md, "Media Session API"
  useEffect(
    () => () => {
      mediaSession.setPositionState();
    },
    [mediaSession, bookId]
  );
};

export default usePositionState;
