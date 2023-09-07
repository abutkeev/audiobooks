import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type MediaCacheEntryState =
  | { state: 'cached' | 'error' }
  | {
      state: 'downloading';
      progress?: number;
    };

interface MediaCacheState {
  available: boolean;
  entries: Record<string, MediaCacheEntryState>;
}

const initialState: MediaCacheState = {
  available: false,
  entries: {},
};

const mediaCacheSlice = createSlice({
  name: 'mediaCache',
  initialState,
  reducers: {
    updateCachedMedia: (state, { payload }: PayloadAction<string[]>) => {
      state.available = true;
      for (const [key, entry] of Object.entries(state.entries)) {
        if (entry.state === 'cached') {
          delete state.entries[key];
        }
      }
      for (const key of payload) {
        state.entries[key] = { state: 'cached' };
      }
    },
    setCachedMediaProgress: (
      state,
      { payload: { url, progress } }: PayloadAction<{ url: string; progress?: number }>
    ) => {
      if (progress === 100) {
        state.entries[url] = { state: 'cached' };
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
    removeCachedMedia: (state, { payload }: PayloadAction<string[]>) => {
      for (const key of payload) {
        delete state.entries[key];
      }
    },
  },
});

export default mediaCacheSlice;
