import { ListenerMiddlewareInstance } from '@reduxjs/toolkit';
import type { PlayerStateSlice } from '..';
import { playerSetup } from '../slice';
import { setPreventLocalStorageSave } from '../internal';

const addPlayerStateSaver = (mw: ListenerMiddlewareInstance<PlayerStateSlice>, playerStateName: string) => {
  let preventSave = false;

  mw.startListening({
    actionCreator: setPreventLocalStorageSave,
    effect: ({ payload }) => {
      preventSave = payload;
    },
  });

  mw.startListening({
    predicate: (action, currentState, originalState) => {
      if (
        preventSave ||
        currentState.player.state === originalState.player.state ||
        currentState.player.bookId === '' ||
        playerSetup.match(action)
      ) {
        return false;
      }

      return true;
    },
    effect: (_, { getState }) => {
      const {
        bookId,
        state: {
          currentChapter,
          position,
          volume,
          speed,
          resetSleepTimerOnActivity,
          preventScreenLock,
          rewindOnPause,
          diagnostics,
        },
      } = getState().player;
      localStorage.setItem(
        playerStateName,
        JSON.stringify({
          bookId,
          currentChapter,
          position,
          volume,
          speed,
          resetSleepTimerOnActivity,
          preventScreenLock,
          rewindOnPause,
          diagnostics,
          updated: new Date().toISOString(),
        })
      );
    },
  });
};

export default addPlayerStateSaver;
