import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { useEffect, useReducer } from 'react';

const cacheName = 'mp3';

export type ChapterCacheState =
  | {
      state: 'cached';
    }
  | undefined;

const initialState: ChapterCacheState[] = [];

const cacheSlice = createSlice({
  name: 'cache',
  initialState,
  reducers: {
    setup: (_, { payload }: PayloadAction<ChapterCacheState[]>) => payload,
  },
});

export const {} = cacheSlice.actions;

const useCache = (chapters: { filename: string }[]) => {
  const { setup } = cacheSlice.actions;
  const [state, dispatch] = useReducer(cacheSlice.reducer, cacheSlice.getInitialState());
  useEffect(() => {
    Promise.all(
      chapters.map(({ filename }) => {
        return caches
          .open(cacheName)
          .then(cache => cache.match(filename))
          .then(result => result && ({ state: 'cached' } as const))
          .catch(() => undefined);
      })
    ).then(state => dispatch(setup(state)));
  }, [chapters]);

  return { state, dispatch };
};

export default useCache;
