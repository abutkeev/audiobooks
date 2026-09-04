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

        useMediaMetadata({ ...bookInfo, chapterTitle });
        usePlaybackState(playing);
        usePositionState({ bookId, position, duration, playbackRate: speed });
        useMediaKeys();
      }
    : () => {};

export default useMediaSession;
