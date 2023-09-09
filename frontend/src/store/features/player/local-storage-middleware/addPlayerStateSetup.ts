import { ListenerMiddlewareInstance } from '@reduxjs/toolkit';
import { PlayerStateSlice, playerSetup, playerSlice, setPreventScreenLock, setResetSleepTimerOnActivity } from '..';
import { parseSavedState } from '.';
import { setPreventLocalStorageSave } from '../internal';

const addPlayerStateSetup = (mw: ListenerMiddlewareInstance<PlayerStateSlice>, playerStateName: string) => {
  const { updatePosition, updateCurrentChapter, updateVolume } = playerSlice.actions;

  mw.startListening({
    actionCreator: playerSetup,
    effect: (_, { getState, dispatch }) => {
      dispatch(setPreventLocalStorageSave(true));
      const { bookId: currentBookId, chapters } = getState().player;

      const { currentChapter, position, volume, resetSleepTimerOnActivity, preventScreenLock, bookId } =
        parseSavedState(playerStateName);

      if (isFinite(volume) && volume >= 0 && volume <= 100) {
        dispatch(updateVolume(volume));
      }

      if (typeof preventScreenLock === 'boolean') {
        dispatch(setPreventScreenLock(preventScreenLock));
      }

      if (typeof resetSleepTimerOnActivity === 'boolean') {
        dispatch(setResetSleepTimerOnActivity(resetSleepTimerOnActivity));
      }

      if (
        currentBookId === bookId &&
        Number.isInteger(currentChapter) &&
        currentChapter > 0 &&
        currentChapter < chapters.length
      ) {
        dispatch(updateCurrentChapter(currentChapter));
      }

      if (currentBookId === bookId && isFinite(position) && position > 0) {
        dispatch(updatePosition(position));
      }
      dispatch(setPreventLocalStorageSave(false));
    },
  });
};

export default addPlayerStateSetup;
