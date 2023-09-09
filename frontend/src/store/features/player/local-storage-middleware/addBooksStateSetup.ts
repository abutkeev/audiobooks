import { ListenerMiddlewareInstance } from '@reduxjs/toolkit';
import { PlayerStateSlice, playerSetup, playerSlice } from '..';
import { parseSavedState } from '.';
import { setPreventLocalStorageSave } from '../internal';

const addBooksStateSetup = (mw: ListenerMiddlewareInstance<PlayerStateSlice>, booksStateName: string) => {
  const { updatePosition, updateCurrentChapter } = playerSlice.actions;

  mw.startListening({
    actionCreator: playerSetup,
    effect: (_, { getState, dispatch }) => {
      dispatch(setPreventLocalStorageSave(true));
      const { bookId, chapters } = getState().player;
      const state = parseSavedState(booksStateName)[bookId];

      if (!state || typeof state !== 'object') return;

      const { currentChapter, position } = state;

      if (Number.isInteger(currentChapter) && currentChapter > 0 && currentChapter < chapters.length) {
        dispatch(updateCurrentChapter(currentChapter));
      }

      if (isFinite(position) && position > 0) {
        dispatch(updatePosition(position));
      }
      dispatch(setPreventLocalStorageSave(false));
    },
  });
};

export default addBooksStateSetup;
