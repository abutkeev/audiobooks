import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { changeVolume, chapterChange, forward, pause, play, rewind } from '@/store/features/player';

const arrowKeysRewindTime = 15;
const letterKeysRewindTime = 30;

const volumeChangeValue = 5;

const useKeyboardShortcuts = () => {
  const { playing, currentChapter, volume } = useAppSelector(({ player: { state } }) => state);
  const dispatch = useAppDispatch();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const { code, metaKey, ctrlKey, altKey, shiftKey } = e;
      const disableDefaultActions = () => {
        e.preventDefault();
      };
      switch (code) {
        case 'Space':
        case 'KeyK':
          dispatch(playing ? pause() : play());
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
          if (metaKey || ctrlKey || altKey) break;
          dispatch(rewind(letterKeysRewindTime));
          disableDefaultActions();
          break;
        case 'KeyL':
          if (metaKey || ctrlKey || altKey) break;
          dispatch(forward(letterKeysRewindTime));
          disableDefaultActions();
          break;
        case 'KeyN':
          if (metaKey || ctrlKey || altKey || !shiftKey) break;
          dispatch(chapterChange(currentChapter + 1));
          disableDefaultActions();
          break;
        case 'KeyP':
          if (metaKey || ctrlKey || altKey || !shiftKey) break;
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
    },
    [dispatch, playing, currentChapter, volume]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentChapter, volume, playing, handleKeyDown]);
};

export default useKeyboardShortcuts;
