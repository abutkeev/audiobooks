import { useEffect } from 'react';

const usePlaybackState = (playing: boolean) => {
  const { mediaSession } = navigator;

  useEffect(() => {
    mediaSession.playbackState = playing ? 'playing' : 'paused';
    return () => {
      mediaSession.playbackState = 'none';
    };
  }, [playing, mediaSession]);
};

export default usePlaybackState;
