import { configureStore, createAction } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
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
import authSlice, { authMiddleware } from './features/auth';
import { websocketMiddleware, websocketSlice } from './features/websocket';
import enhancedApi from '../api/enhancedApi';

export const store = configureStore({
  reducer: {
    [enhancedApi.reducerPath]: enhancedApi.reducer,
    [searchSlice.name]: searchSlice.reducer,
    [titleSlice.name]: titleSlice.reducer,
    [snackbarsSlice.name]: snackbarsSlice.reducer,
    [mediaCacheSlice.name]: mediaCacheSlice.reducer,
    [playerSlice.name]: playerSlice.reducer,
    [authSlice.name]: authSlice.reducer,
    [websocketSlice.name]: websocketSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .prepend([
        createMediaCacheListenerMiddleware('mp3'),
        audioControlMiddleware,
        createLocalStorageMiddleware({ playerStateName: 'playerState', booksStateName: 'booksState' }),
        createPlayerUtilsMiddleware({ copyBookStateUrl, showMessage }),
        websocketMiddleware,
        authMiddleware,
      ])
      .concat(enhancedApi.middleware),
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
