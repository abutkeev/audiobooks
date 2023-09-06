import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { useEffect, useReducer } from 'react';
import axios from 'axios';

const cacheName = 'mp3';

export type ChapterCacheState =
  | { state: 'cached' }
  | {
      state: 'downloading';
      progress?: number;
    }
  | { state: 'error' }
  | { state: 'pending' }
  | undefined;

const initialState: ChapterCacheState[] = [];

const cacheSlice = createSlice({
  name: 'cache',
  initialState,
  reducers: {
    setup: (_, { payload }: PayloadAction<ChapterCacheState[]>) => payload,
    startDownload: state => {
      return state.map(entry => {
        if (entry) return entry;
        return { state: 'pending' };
      });
    },
    setProgress: (state, { payload: { index, progress } }: PayloadAction<{ index: number; progress?: number }>) => {
      if (index < 0 || index >= state.length) return;
      if (progress === 100) {
        state[index] = { state: 'cached' };
        return;
      }
      state[index] = {
        state: 'downloading',
        progress: progress && progress > 0 && progress < 100 ? progress : undefined,
      };
    },
    setError: (state, { payload }: PayloadAction<number>) => {
      if (payload < 0 || payload >= state.length) return;
      state[payload] = { state: 'error' };
    },
  },
});

export const { startDownload } = cacheSlice.actions;

type Chapters = { filename: string }[];

const { setProgress, setError } = cacheSlice.actions;
const useDownload = (chapters: Chapters, { state, dispatch }: ReturnType<typeof useCache>) => {
  useEffect(() => {
    if (state.find(entry => entry?.state === 'downloading')) return;

    const index = state.findIndex(entry => entry?.state === 'pending');
    if (index === -1) return;

    const url = chapters[index].filename;
    const download = () =>
      axios({
        url,
        onDownloadProgress: ({ loaded, total }) => {
          dispatch(setProgress({ index, progress: total ? (loaded * 100) / total : undefined }));
        },
      })
        .then(() => dispatch(setProgress({ index, progress: 100 })))
        .catch(e => {
          console.error(`can't download ${url}`, e);
          dispatch(setError(index));
          setTimeout(download, 1000);
        });

    download();
  }, [state, dispatch, chapters]);
};

const useCache = (chapters: Chapters) => {
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

  useDownload(chapters, { state, dispatch });

  return { state, dispatch };
};

export default useCache;
