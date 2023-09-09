import { ListenerMiddlewareInstance } from '@reduxjs/toolkit';
import { PlayerStateSlice, playerSetup } from '..';
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
        state: { currentChapter, position, volume, resetSleepTimerOnActivity, preventScreenLock },
      } = getState().player;
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
    },
  });
};

export default addPlayerStateSaver;
