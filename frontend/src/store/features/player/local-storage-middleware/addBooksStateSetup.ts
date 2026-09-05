import { ListenerMiddlewareInstance } from '@reduxjs/toolkit';
import type { PlayerStateSlice } from '..';
import { playerSetup, playerSlice } from '../slice';
import { readSavedBookState } from '.';
import { setPreventLocalStorageSave } from '../internal';

const addBooksStateSetup = (mw: ListenerMiddlewareInstance<PlayerStateSlice>) => {
  const { updatePosition, updateCurrentChapter } = playerSlice.actions;

  mw.startListening({
    actionCreator: playerSetup,
    effect: ({ payload }, { getState, dispatch }) => {
      // a chapter chosen by the user beats the saved one
      if (payload.currentChapter !== undefined) return;

      dispatch(setPreventLocalStorageSave(true));
      const { bookId, chapters } = getState().player;
      const { currentChapter, position } = readSavedBookState(bookId, chapters.length);

      if (currentChapter > 0) {
        dispatch(updateCurrentChapter(currentChapter));
      }

      if (position > 0) {
        dispatch(updatePosition(position));
      }
      dispatch(setPreventLocalStorageSave(false));
    },
  });
};

export default addBooksStateSetup;
