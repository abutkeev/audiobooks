import { createListenerMiddleware } from '@reduxjs/toolkit';
import { PlayerStateSlice } from '..';
import addBooksStateSetup from './addBooksStateSetup';
import addPlayerStateSetup from './addPlayerStateSetup';
import addBookStateSaver from './addBookStateSaver';
import addPlayerStateSaver from './addPlayerStateSaver';

export const parseSavedState = (name: string) => {
  const state = localStorage.getItem(name);
  if (!state) return {};
  try {
    const parsedState = JSON.parse(state);
    if (!parsedState || typeof parsedState !== 'object') return {};
    return parsedState;
  } catch (e) {
    console.error(`Can't parse ${name}`, e);
    return {};
  }
};

export const createLocalStorageMiddleware = ({
  playerStateName,
  booksStateName,
}: {
  playerStateName: string;
  booksStateName: string;
}) => {
  const mw = createListenerMiddleware<PlayerStateSlice>();
  addBooksStateSetup(mw, booksStateName);
  addBookStateSaver(mw, booksStateName);
  addPlayerStateSetup(mw, playerStateName);
  addPlayerStateSaver(mw, playerStateName);

  return mw.middleware;
};
