import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from '../api/api';
import searchSlice from './features/search';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import titleSlice from './features/title';
import snackbarsSlice from './features/snackbars';
import mediaCacheSlice, { createMediaCacheListenerMiddleware } from './features/media-cache';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [searchSlice.name]: searchSlice.reducer,
    [titleSlice.name]: titleSlice.reducer,
    [snackbarsSlice.name]: snackbarsSlice.reducer,
    [mediaCacheSlice.name]: mediaCacheSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().prepend(createMediaCacheListenerMiddleware('mp3')).concat(api.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
