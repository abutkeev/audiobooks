import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  changeSpeed,
  changeVolume,
  forward,
  maxVolume,
  nextChapter,
  pause,
  play,
  previousChapter,
  rewind,
} from '@/store/features/player';

const arrowKeysRewindTime = 15;
const letterKeysRewindTime = 30;

const volumeChangeValue = 5;

const speedChangeValue = 0.25;

// a custom speed must never skip a round value
const stepSpeed = (speed: number, direction: 1 | -1) =>
  ((direction > 0 ? Math.floor(speed / speedChangeValue) : Math.ceil(speed / speedChangeValue)) + direction) *
  speedChangeValue;

// menus, dialogs and text fields have their own keyboard handling, player shortcuts would fire on top of it.
// player sliders are excluded: MUI keeps focus on the range input after a click, shortcuts must survive that
const handledElsewhere = (target: EventTarget | null) =>
  target instanceof Element && !!target.closest('input:not([type="range"]), textarea, [role="menu"], [role="dialog"]');

const useKeyboardShortcuts = () => {
  const { playing, volume, speed } = useAppSelector(({ player: { state } }) => state);
  const dispatch = useAppDispatch();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (handledElsewhere(e.target)) return;

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
          dispatch(nextChapter());
          disableDefaultActions();
          break;
        case 'KeyP':
          if (metaKey || ctrlKey || altKey || !shiftKey) break;
          dispatch(previousChapter());
          disableDefaultActions();
          break;
        case 'ArrowUp':
          dispatch(changeVolume(volume < maxVolume - volumeChangeValue ? volume + volumeChangeValue : maxVolume));
          disableDefaultActions();
          break;
        case 'ArrowDown':
          dispatch(changeVolume(volume > volumeChangeValue ? volume - volumeChangeValue : 0));
          disableDefaultActions();
          break;
        case 'Period':
          if (metaKey || ctrlKey || altKey || !shiftKey) break;
          dispatch(changeSpeed(stepSpeed(speed, 1)));
          disableDefaultActions();
          break;
        case 'Comma':
          if (metaKey || ctrlKey || altKey || !shiftKey) break;
          dispatch(changeSpeed(stepSpeed(speed, -1)));
          disableDefaultActions();
          break;
      }
    },
    [dispatch, playing, volume, speed]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};

export default useKeyboardShortcuts;
