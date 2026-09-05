import { useEffect } from 'react';

const usePlaybackState = ({ active, playing }: { active: boolean; playing: boolean }) => {
  const { mediaSession } = navigator;

  useEffect(() => {
    mediaSession.playbackState = !active ? 'none' : playing ? 'playing' : 'paused';
  }, [active, playing, mediaSession]);

  // a reset on every change flickers the lock screen controls,
  // see docs/ai/frontend/player.md, "Media Session API"
  useEffect(
    () => () => {
      mediaSession.playbackState = 'none';
    },
    [mediaSession]
  );
};

export default usePlaybackState;
