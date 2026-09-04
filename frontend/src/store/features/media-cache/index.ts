import mediaCacheSlice from './slice';
import { getSliceActionCreator } from '@/store';

export { default as createMediaCacheListenerMiddleware } from './getListenerMiddleware';
export { default as mediaCacheSupported } from './mediaCacheSupported';
export type { MediaCacheEntryState } from './slice';
export type MediaCacheStateSlice = { [mediaCacheSlice.name]: ReturnType<typeof mediaCacheSlice.getInitialState> };

export const { removeCachedMedia, startMediaCacheUpdates, stopMediaCacheUpdates } = mediaCacheSlice.actions;

export default mediaCacheSlice;

const createSliceAction = getSliceActionCreator(mediaCacheSlice);

export const addMediaToCache = createSliceAction<string[]>('addMediaToCache');
