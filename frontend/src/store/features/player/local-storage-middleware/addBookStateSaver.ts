import { ListenerMiddlewareInstance } from '@reduxjs/toolkit';
import { PlayerStateSlice, playerSetup } from '..';
import { setPreventLocalStorageSave } from '../internal';
import { parseSavedState } from '.';

const addBookStateSaver = (mw: ListenerMiddlewareInstance<PlayerStateSlice>, booksStateName: string) => {
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
        state: { currentChapter, position },
      } = getState().player;
      const state = parseSavedState(booksStateName);
      const updated = new Date().toISOString();
      state[bookId] = { currentChapter, position, updated };
      localStorage.setItem(booksStateName, JSON.stringify(state));
    },
  });
};

export default addBookStateSaver;
