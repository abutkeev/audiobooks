import useMediaMetadata from './useMediaMetadata';
import usePlaybackState from './usePlaybackState';
import usePositionState from './usePositionState';
import useMediaKeys from './useMediaKeys';
import { useAppSelector } from '../../store';

const useMediaSession = () => {
  const {
    bookInfo,
    chapters,
    state: { currentChapter, playing, position, duration },
  } = useAppSelector(({ player }) => player);

  if (!('mediaSession' in navigator)) return;

  const chapterTitle = chapters.length !== 0 && chapters.length < currentChapter ? chapters[currentChapter].title : '';

  useMediaMetadata({ ...bookInfo, chapterTitle });
  usePlaybackState(playing);
  usePositionState({ position, duration });
  useMediaKeys();
};

export default useMediaSession;
