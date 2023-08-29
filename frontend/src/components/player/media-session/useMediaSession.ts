import usePlayerState from '../state/usePlayerState';
import useMediaMetadata from './useMediaMetadata';
import usePlaybackState from './usePlaybackState';
import usePositionState from './usePositionState';
import useMediaKeys from './useMediaKeys';

export interface BookInfo {
  name: string;
  author: string;
  series?: string;
}

const useMediaSession = (
  info: BookInfo,
  chapterTitle: string,
  { playing, duration, position }: ReturnType<typeof usePlayerState>[0]['state'],
  dispatch: ReturnType<typeof usePlayerState>[1]
) => {
  if (!('mediaSession' in navigator)) return;

  useMediaMetadata({ ...info, chapterTitle });
  usePlaybackState(playing);
  usePositionState({ position, duration });
  useMediaKeys(dispatch);
};

export default useMediaSession;
