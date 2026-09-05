import useMediaMetadata from './useMediaMetadata';
import usePlaybackState from './usePlaybackState';
import usePositionState from './usePositionState';
import useMediaKeys from './useMediaKeys';
import { useAppSelector } from '@/store';

const useMediaSession =
  'mediaSession' in navigator
    ? () => {
        const {
          bookId,
          bookInfo,
          chapters,
          state: { currentChapter, playing, position, duration, speed },
        } = useAppSelector(({ player }) => player);

        const chapterTitle = chapters[currentChapter]?.title ?? '';
        // a closed player is a state of the hooks, not their absence,
        // see docs/ai/frontend/player.md, "Media Session API"
        const active = !!bookId;

        useMediaMetadata({ active, ...bookInfo, chapterTitle });
        usePlaybackState({ active, playing });
        usePositionState({ bookId, position, duration, playbackRate: speed });
        useMediaKeys(active);
      }
    : () => {};

export default useMediaSession;
