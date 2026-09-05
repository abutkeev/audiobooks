import { ListenerMiddlewareInstance } from '@reduxjs/toolkit';
import type { PlayerStateSlice } from '..';
import { maxVolume, normalizeSpeed } from '../limits';
import {
  playerSetup,
  playerSlice,
  setDiagnostics,
  setPreventScreenLock,
  setResetSleepTimerOnActivity,
  setRewindOnPause,
} from '../slice';
import { parseSavedState } from '.';
import { setPreventLocalStorageSave } from '../internal';

const addPlayerStateSetup = (mw: ListenerMiddlewareInstance<PlayerStateSlice>, playerStateName: string) => {
  const { updatePosition, updateCurrentChapter, updateVolume, updateSpeed } = playerSlice.actions;

  mw.startListening({
    actionCreator: playerSetup,
    effect: (_, { getState, dispatch }) => {
      dispatch(setPreventLocalStorageSave(true));
      const { bookId: currentBookId, chapters } = getState().player;

      const {
        currentChapter,
        position,
        volume,
        speed,
        resetSleepTimerOnActivity,
        preventScreenLock,
        rewindOnPause,
        diagnostics,
        bookId,
      } = parseSavedState(playerStateName);

      if (isFinite(volume) && volume >= 0 && volume <= maxVolume) {
        dispatch(updateVolume(volume));
      }

      if (typeof speed === 'number') {
        dispatch(updateSpeed(normalizeSpeed(speed)));
      }

      if (typeof preventScreenLock === 'boolean') {
        dispatch(setPreventScreenLock(preventScreenLock));
      }

      if (typeof resetSleepTimerOnActivity === 'boolean') {
        dispatch(setResetSleepTimerOnActivity(resetSleepTimerOnActivity));
      }

      if (typeof rewindOnPause === 'boolean') {
        dispatch(setRewindOnPause(rewindOnPause));
      }

      if (typeof diagnostics === 'boolean') {
        dispatch(setDiagnostics(diagnostics));
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
