import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface BookInfo {
  name: string;
  author: string;
  series?: string;
  cover?: {
    type: string;
    filename: string;
  };
}

export interface BookChapter {
  title: string;
  filename: string;
}

interface PlayerStore {
  state: {
    currentChapter: number;
    position: number;
    volume: number;
    duration?: number;
    playing: boolean;
    pauseOnChapterEnd: boolean;
    resetSleepTimerOnActivity: boolean;
    preventScreenLock: boolean;
    error: string;
  };
  bookId: string;
  bookInfo: BookInfo;
  chapters: BookChapter[];
}

const initialState: PlayerStore = {
  state: {
    currentChapter: 0,
    position: 0,
    volume: 100,
    duration: undefined,
    playing: false,
    pauseOnChapterEnd: false,
    resetSleepTimerOnActivity: true,
    preventScreenLock: true,
    error: '',
  },
  bookId: '',
  bookInfo: {
    name: '',
    author: '',
  },
  chapters: [],
};

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    playerSetup: (_, { payload: { bookId, chapters } }: PayloadAction<Pick<PlayerStore, 'bookId' | 'chapters'>>) => ({
      ...initialState,
      bookId,
      chapters,
    }),
    playerReset: () => initialState,
    setBookInfo: (state, { payload }: PayloadAction<PlayerStore['bookInfo']>) => {
      state.bookInfo = payload;
    },
    updatePlaying: (store, { payload }: PayloadAction<boolean>) => {
      store.state.playing = payload;
    },
    updatePosition: (store, { payload }: PayloadAction<number>) => {
      store.state.position = payload;
    },
    updateDuration: (store, { payload }: PayloadAction<number | undefined>) => {
      store.state.duration = payload;
    },
    updateVolume: (store, { payload }: PayloadAction<number>) => {
      store.state.volume = payload;
    },
    updateCurrentChapter: (store, { payload }: PayloadAction<number>) => {
      store.state.currentChapter = payload;
    },
    setPauseOnChapterEnd: (store, { payload }: PayloadAction<boolean>) => {
      store.state.pauseOnChapterEnd = payload;
    },
    setResetSleepTimerOnActivity: (store, { payload }: PayloadAction<boolean>) => {
      store.state.resetSleepTimerOnActivity = payload;
    },
    setPreventScreenLock: (store, { payload }: PayloadAction<boolean>) => {
      store.state.preventScreenLock = payload;
    },
    setError: (store, { payload }: PayloadAction<string>) => {
      store.state.error = payload;
    },
  },
});
export const {
  playerSetup,
  playerReset,
  setBookInfo,
  setPauseOnChapterEnd,
  setResetSleepTimerOnActivity,
  setPreventScreenLock,
} = playerSlice.actions;
