import { configureStore, createAction } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from '../api/api';
import searchSlice from './features/search';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import titleSlice from './features/title';
import snackbarsSlice from './features/snackbars';
import mediaCacheSlice, { createMediaCacheListenerMiddleware } from './features/media-cache';
import {
  audioControlMiddleware,
  createPlayerUtilsMiddleware,
  createLocalStorageMiddleware,
  playerSlice,
} from './features/player';
import copyBookStateUrl from '../utils/copyBookStateUrl';
import showMessage from '../utils/showMessage';
import authSlice from './features/auth';
import { websocketMiddleware } from './features/websocket';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [searchSlice.name]: searchSlice.reducer,
    [titleSlice.name]: titleSlice.reducer,
    [snackbarsSlice.name]: snackbarsSlice.reducer,
    [mediaCacheSlice.name]: mediaCacheSlice.reducer,
    [playerSlice.name]: playerSlice.reducer,
    [authSlice.name]: authSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .prepend([
        createMediaCacheListenerMiddleware('mp3'),
        audioControlMiddleware,
        createLocalStorageMiddleware({ playerStateName: 'playerState', booksStateName: 'booksState' }),
        createPlayerUtilsMiddleware({ copyBookStateUrl, showMessage }),
        websocketMiddleware,
      ])
      .concat(api.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function getSliceActionCreator(slice: { name: string }) {
  return function <T = undefined>(name: string) {
    return createAction<T>(`${slice.name}/${name}`);
  };
}
