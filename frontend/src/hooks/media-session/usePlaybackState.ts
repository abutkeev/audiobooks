import { useEffect } from 'react';

const usePlaybackState = (playing: boolean) => {
  const { mediaSession } = navigator;

  useEffect(() => {
    mediaSession.playbackState = playing ? 'playing' : 'paused';
  }, [playing, mediaSession]);

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
