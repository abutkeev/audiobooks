import { useEffect } from 'react';
import { useAppDispatch } from '@/store';
import { changePosition, forward, nextChapter, pause, play, previousChapter, rewind } from '@/store/features/player';

const mediaKeysRewindTime = 10;

const useMediaKeys =
  'mediaSession' in navigator
    ? () => {
        const dispatch = useAppDispatch();

        const { mediaSession } = navigator;

        useEffect(() => {
          // iOS hides the seek buttons when both pairs are handled, so switching chapters
          // has to live on the track ones, see docs/ai/frontend/player.md, "Media Session API"
          mediaSession.setActionHandler('previoustrack', () => dispatch(previousChapter()));
          mediaSession.setActionHandler('nexttrack', () => dispatch(nextChapter()));
          mediaSession.setActionHandler('seekbackward', ({ seekOffset }) =>
            dispatch(rewind(seekOffset || mediaKeysRewindTime))
          );
          mediaSession.setActionHandler('seekforward', ({ seekOffset }) =>
            dispatch(forward(seekOffset || mediaKeysRewindTime))
          );
          mediaSession.setActionHandler('play', () => dispatch(play()));
          mediaSession.setActionHandler('pause', () => dispatch(pause()));
          mediaSession.setActionHandler('seekto', ({ seekTime }) =>
            seekTime !== undefined ? dispatch(changePosition(seekTime)) : undefined
          );
          return () => {
            mediaSession.setActionHandler('previoustrack', null);
            mediaSession.setActionHandler('seekbackward', null);
            mediaSession.setActionHandler('nexttrack', null);
            mediaSession.setActionHandler('seekforward', null);
            mediaSession.setActionHandler('play', null);
            mediaSession.setActionHandler('pause', null);
            mediaSession.setActionHandler('seekto', null);
          };
        }, [dispatch, mediaSession]);
      }
    : () => {};

export default useMediaKeys;
