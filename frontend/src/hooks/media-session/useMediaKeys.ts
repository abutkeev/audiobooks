import { useEffect } from 'react';
import { useAppDispatch } from '@/store';
import { changePosition, forward, pause, rewind } from '@/store/features/player';

const mediaKeysRewindTime = 10;

const useMediaKeys =
  'mediaSession' in navigator
    ? (active: boolean) => {
        const dispatch = useAppDispatch();

        const { mediaSession } = navigator;

        useEffect(() => {
          if (!active) return;

          mediaSession.setActionHandler('previoustrack', () => dispatch(rewind(mediaKeysRewindTime)));
          mediaSession.setActionHandler('nexttrack', () => dispatch(forward(mediaKeysRewindTime)));
          mediaSession.setActionHandler('seekbackward', ({ seekOffset }) =>
            dispatch(rewind(seekOffset || mediaKeysRewindTime))
          );
          mediaSession.setActionHandler('seekforward', ({ seekOffset }) =>
            dispatch(forward(seekOffset || mediaKeysRewindTime))
          );
          // play is left to the browser on purpose, see docs/ai/frontend/player.md, "Заморозка"
          mediaSession.setActionHandler('pause', () => dispatch(pause()));
          mediaSession.setActionHandler('seekto', ({ seekTime }) =>
            seekTime !== undefined ? dispatch(changePosition(seekTime)) : undefined
          );
          return () => {
            mediaSession.setActionHandler('previoustrack', null);
            mediaSession.setActionHandler('seekbackward', null);
            mediaSession.setActionHandler('nexttrack', null);
            mediaSession.setActionHandler('seekforward', null);
            mediaSession.setActionHandler('pause', null);
            mediaSession.setActionHandler('seekto', null);
          };
        }, [active, dispatch, mediaSession]);
      }
    : () => {};

export default useMediaKeys;
