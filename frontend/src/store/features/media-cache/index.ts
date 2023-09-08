import mediaCacheSlice from './slice';
import { getSliceActionCreator } from '../..';

export { default as createMediaCacheListenerMiddleware } from './getListenerMiddleware';
export type { MediaCacheEntryState } from './slice';
export type MediaCacheStateSlice = { [mediaCacheSlice.name]: ReturnType<typeof mediaCacheSlice.getInitialState> };

export const { removeCachedMedia } = mediaCacheSlice.actions;

export default mediaCacheSlice;

const createSliceAction = getSliceActionCreator(mediaCacheSlice);

export const startMediaCacheUpdates = createSliceAction('startMediaCacheUpdates');
export const stopMediaCacheUpdates = createSliceAction('stopMediaCacheUpdates');
export const addMediaToCache = createSliceAction<string[]>('addMediaToCache');
