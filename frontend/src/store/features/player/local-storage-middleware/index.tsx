import { createListenerMiddleware } from '@reduxjs/toolkit';
import type { PlayerStateSlice } from '..';
import addBooksStateSetup from './addBooksStateSetup';
import addPlayerStateSetup from './addPlayerStateSetup';
import addBookStateSaver from './addBookStateSaver';
import addPlayerStateSaver from './addPlayerStateSaver';

export const playerStateName = 'playerState';
export const booksStateName = 'booksState';

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

export const isValidChapter = (chapter: unknown, chaptersCount: number): chapter is number =>
  Number.isInteger(chapter) && (chapter as number) > 0 && (chapter as number) < chaptersCount;

export const isValidPosition = (position: unknown): position is number =>
  typeof position === 'number' && isFinite(position) && position > 0;

/** Where a book stands by the browser's own record, with the same validity rules everywhere. */
export const readSavedBookState = (bookId: string, chaptersCount: number) => {
  const { currentChapter, position } = parseSavedState(booksStateName)[bookId] ?? {};

  return {
    currentChapter: isValidChapter(currentChapter, chaptersCount) ? currentChapter : 0,
    position: isValidPosition(position) ? position : 0,
  };
};

export const createLocalStorageMiddleware = () => {
  const mw = createListenerMiddleware<PlayerStateSlice>();
  addBooksStateSetup(mw);
  addBookStateSaver(mw);
  addPlayerStateSetup(mw);
  addPlayerStateSaver(mw);

  return mw.middleware;
};
