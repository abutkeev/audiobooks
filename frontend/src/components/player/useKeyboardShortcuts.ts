import { useEffect } from 'react';
import usePlayerState, { rewind, forward, playPause, chapterChange, changeVolume } from './state/usePlayerState';

const mediaKeysRewindTime = 10;
const arrowKeysRewindTime = 15;
const letterKeysRewindTime = 30;

const volumeChangeValue = 5;

const useKeyboardShortcuts = (
  { currentChapter, volume }: ReturnType<typeof usePlayerState>[0]['state'],
  dispatch: ReturnType<typeof usePlayerState>[1]
) => {
  const handleKeyDown = (e: KeyboardEvent) => {
    const { code } = e;
    const disableDefaultActions = () => {
      e.preventDefault();
    };
    switch (code) {
      case 'Space':
      case 'KeyK':
        dispatch(playPause());
        disableDefaultActions();
        break;
      case 'ArrowLeft':
        dispatch(rewind(arrowKeysRewindTime));
        disableDefaultActions();
        break;
      case 'ArrowRight':
        dispatch(forward(arrowKeysRewindTime));
        disableDefaultActions();
        break;
      case 'KeyJ':
        dispatch(rewind(letterKeysRewindTime));
        disableDefaultActions();
        break;
      case 'KeyL':
        dispatch(forward(letterKeysRewindTime));
        disableDefaultActions();
        break;
      case 'KeyN':
        dispatch(chapterChange(currentChapter + 1));
        disableDefaultActions();
        break;
      case 'KeyP':
        dispatch(chapterChange(currentChapter - 1));
        disableDefaultActions();
        break;
      case 'ArrowUp':
        dispatch(changeVolume(volume < 100 - volumeChangeValue ? volume + volumeChangeValue : 100));
        disableDefaultActions();
        break;
      case 'ArrowDown':
        dispatch(changeVolume(volume > volumeChangeValue ? volume - volumeChangeValue : 0));
        disableDefaultActions();
        break;
    }
  };

  useEffect(() => {
    navigator.mediaSession.setActionHandler('previoustrack', () => dispatch(rewind(mediaKeysRewindTime)));
    navigator.mediaSession.setActionHandler('nexttrack', () => dispatch(forward(mediaKeysRewindTime)));
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      navigator.mediaSession.setActionHandler('previoustrack', null);
      navigator.mediaSession.setActionHandler('nexttrack', null);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentChapter, volume]);
};

export default useKeyboardShortcuts;
