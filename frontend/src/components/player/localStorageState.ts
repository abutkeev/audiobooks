import { useEffect } from 'react';
import { PlayerState } from './usePlayerState';

const playerStateName = 'playerState';

export const getSavedState = (initialState: PlayerState, bookId: string, chaptersLength: number) => {
  const state = { ...initialState };
  const savedState = localStorage.getItem(playerStateName);
  if (!savedState) return state;
  try {
    const {
      currentChapter,
      position,
      bookId: savedBookId,
      volume,
      resetSleepTimerOnActivity,
      preventScreenLock,
    } = JSON.parse(savedState);
    if (isFinite(volume) && volume > 0 && volume < 100) {
      state.volume = volume;
    }

    if (typeof preventScreenLock === 'boolean') {
      state.preventScreenLock = preventScreenLock;
    }

    if (typeof resetSleepTimerOnActivity === 'boolean') {
      state.resetSleepTimerOnActivity = resetSleepTimerOnActivity;
    }

    if (savedBookId !== bookId) return state;
    if (Number.isInteger(currentChapter) && currentChapter > 0 && currentChapter < chaptersLength) {
      state.currentChapter = currentChapter;
    }
    if (isFinite(position) && position > 0) {
      state.position = position;
    }
  } catch (e) {
    console.error("Can't parse state", e);
  }
  return state;
};

export const useSaveState = (state: PlayerState, bookId: string) => {
  const { currentChapter, position, volume, resetSleepTimerOnActivity, preventScreenLock } = state;
  useEffect(() => {
    localStorage.setItem(
      playerStateName,
      JSON.stringify({
        bookId,
        currentChapter,
        position,
        volume,
        resetSleepTimerOnActivity,
        preventScreenLock,
        updated: new Date().toISOString(),
      })
    );
  }, [bookId, currentChapter, position, volume, resetSleepTimerOnActivity, preventScreenLock]);
};
