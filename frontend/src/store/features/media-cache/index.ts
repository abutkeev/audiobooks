import { createAction } from '@reduxjs/toolkit';
import mediaCacheSlice from './slice';

export { default as createMediaCacheListenerMiddleware } from './getListenerMiddleware';
export type { MediaCacheEntryState } from './slice';
export type MediaCacheStateSlice = { [mediaCacheSlice.name]: ReturnType<typeof mediaCacheSlice.getInitialState> };

export const { removeCachedMedia } = mediaCacheSlice.actions;

export default mediaCacheSlice;

function createSliceAction<T = undefined>(name: string) {
  return createAction<T>(`${mediaCacheSlice}/${name}`);
}

export const startMediaCacheUpdates = createSliceAction('startMediaCacheUpdates');
export const stopMediaCacheUpdates = createSliceAction('stopMediaCacheUpdates');
export const addMediaToCache = createSliceAction<string[]>('addMediaToCache');
