import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type MediaCacheEntryState =
  | { state: 'cached'; size?: number }
  | { state: 'error' }
  | {
      state: 'downloading';
      progress?: number;
    };

interface CachedMediaEntry {
  url: string;
  size?: number;
}

interface MediaCacheState {
  available: boolean;
  entries: Record<string, MediaCacheEntryState>;
  subscribers: string[];
}

const initialState: MediaCacheState = {
  available: false,
  entries: {},
  subscribers: [],
};

const mediaCacheSlice = createSlice({
  name: 'mediaCache',
  initialState,
  reducers: {
    updateCachedMedia: (state, { payload }: PayloadAction<CachedMediaEntry[]>) => {
      state.available = true;
      for (const [key, entry] of Object.entries(state.entries)) {
        if (entry.state === 'cached') {
          delete state.entries[key];
        }
      }
      for (const { url, size } of payload) {
        state.entries[url] = { state: 'cached', size };
      }
    },
    setCachedMediaProgress: (
      state,
      { payload: { url, progress, size } }: PayloadAction<{ url: string; progress?: number; size?: number }>
    ) => {
      if (progress === 100) {
        state.entries[url] = { state: 'cached', size };
        return;
      }
      state.entries[url] = {
        state: 'downloading',
        progress: progress && progress > 0 && progress < 100 ? progress : undefined,
      };
    },
    setCachedMediaError: (state, { payload }: PayloadAction<string>) => {
      state.entries[payload] = { state: 'error' };
    },
    // listener effects run later than this reducer, so they read the list from the state
    startMediaCacheUpdates: (state, { payload }: PayloadAction<string>) => {
      if (!state.subscribers.includes(payload)) {
        state.subscribers.push(payload);
      }
    },
    stopMediaCacheUpdates: (state, { payload }: PayloadAction<string>) => {
      state.subscribers = state.subscribers.filter(subscriber => subscriber !== payload);
    },
    removeCachedMedia: (state, { payload }: PayloadAction<string[]>) => {
      for (const key of payload) {
        delete state.entries[key];
      }
    },
  },
});

export default mediaCacheSlice;
