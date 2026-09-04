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
  // reading the cache takes noticeable time, and the ui must not call it unavailable meanwhile
  reading: boolean;
  entries: Record<string, MediaCacheEntryState>;
  subscribers: string[];
}

const initialState: MediaCacheState = {
  available: false,
  reading: false,
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

      const rounded = progress && progress > 0 && progress < 100 ? Math.round(progress) : undefined;
      const current = state.entries[url];
      // xhr reports progress dozens of times a second: without this every report would
      // rewrite the entry and rerender each subscriber of the cache state
      if (current?.state === 'downloading' && current.progress === rounded) return;

      state.entries[url] = { state: 'downloading', progress: rounded };
    },
    clearCachedMediaProgress: (state, { payload }: PayloadAction<string>) => {
      if (state.entries[payload]?.state === 'downloading') {
        delete state.entries[payload];
      }
    },
    setCachedMediaError: (state, { payload }: PayloadAction<string>) => {
      state.entries[payload] = { state: 'error' };
    },
    // listener effects run later than this reducer, so they read the list from the state
    setMediaCacheReading: (state, { payload }: PayloadAction<boolean>) => {
      state.reading = payload;
    },
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
