import { ListenerMiddlewareInstance } from '@reduxjs/toolkit';
import type { PlayerStateSlice } from '..';
import { maxVolume, normalizeSpeed } from '../limits';
import { playerSetup, playerSlice, setDiagnostics, setPreventScreenLock, setResetSleepTimerOnActivity } from '../slice';
import { isValidChapter, isValidPosition, parseSavedState, playerStateName } from '.';
import { setPreventLocalStorageSave } from '../internal';

const addPlayerStateSetup = (mw: ListenerMiddlewareInstance<PlayerStateSlice>) => {
  const { updatePosition, updateCurrentChapter, updateVolume, updateSpeed } = playerSlice.actions;

  mw.startListening({
    actionCreator: playerSetup,
    effect: ({ payload }, { getState, dispatch }) => {
      dispatch(setPreventLocalStorageSave(true));
      const { bookId: currentBookId, chapters } = getState().player;

      const {
        currentChapter,
        position,
        volume,
        speed,
        resetSleepTimerOnActivity,
        preventScreenLock,
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

      if (typeof diagnostics === 'boolean') {
        dispatch(setDiagnostics(diagnostics));
      }

      // a chapter chosen by the user beats the saved one
      const restorePlace = payload.currentChapter === undefined && currentBookId === bookId;

      if (restorePlace && isValidChapter(currentChapter, chapters.length)) {
        dispatch(updateCurrentChapter(currentChapter));
      }

      if (restorePlace && isValidPosition(position)) {
        dispatch(updatePosition(position));
      }
      dispatch(setPreventLocalStorageSave(false));
    },
  });
};

export default addPlayerStateSetup;
