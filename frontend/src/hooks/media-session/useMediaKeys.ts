import { useEffect } from 'react';
import { useAppDispatch } from '@/store';
import { changePosition, forward, pause, play, rewind } from '@/store/features/player';

const mediaKeysRewindTime = 10;

const useMediaKeys = () => {
  const dispatch = useAppDispatch();

  if (!('mediaSession' in navigator)) return;
  const { mediaSession } = navigator;

  useEffect(() => {
    mediaSession.setActionHandler('previoustrack', () => dispatch(rewind(mediaKeysRewindTime)));
    mediaSession.setActionHandler('seekbackward', ({ seekOffset }) =>
      dispatch(rewind(seekOffset || mediaKeysRewindTime))
    );
    mediaSession.setActionHandler('nexttrack', () => dispatch(forward(mediaKeysRewindTime)));
    mediaSession.setActionHandler('seekforward', ({ seekOffset }) =>
      dispatch(forward(seekOffset || mediaKeysRewindTime))
    );
    mediaSession.setActionHandler('play', () => dispatch(play()));
    mediaSession.setActionHandler('pause', () => dispatch(pause()));
    mediaSession.setActionHandler('seekto', ({ seekTime }) => seekTime && dispatch(changePosition(seekTime)));
    return () => {
      mediaSession.setActionHandler('previoustrack', null);
      mediaSession.setActionHandler('seekbackward', null);
      mediaSession.setActionHandler('nexttrack', null);
      mediaSession.setActionHandler('seekforward', null);
      mediaSession.setActionHandler('play', null);
      mediaSession.setActionHandler('pause', null);
      mediaSession.setActionHandler('seekto', null);
    };
  }, []);
};

export default useMediaKeys;
