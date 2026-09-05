import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface BookInfo {
  name: string;
  author: string;
  series?: string;
  cover?: {
    type: string;
    filename: string;
  };
  draft?: boolean;
}

export interface BookChapter {
  title: string;
  filename: string;
  duration?: number;
}

export interface PlayerSetupPayload {
  bookId: string;
  chapters: BookChapter[];
  playing?: boolean;
  /** A chapter chosen by the user: the saved one is not restored over it. */
  currentChapter?: number;
}

interface PlayerStore {
  state: {
    currentChapter: number;
    position: number;
    volume: number;
    speed: number;
    duration?: number;
    playing: boolean;
    pauseOnChapterEnd: boolean;
    resetSleepTimerOnActivity: boolean;
    preventScreenLock: boolean;
    diagnostics: boolean;
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
    speed: 1,
    duration: undefined,
    playing: false,
    pauseOnChapterEnd: false,
    resetSleepTimerOnActivity: true,
    preventScreenLock: true,
    diagnostics: false,
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
    playerSetup: (
      _,
      { payload: { bookId, chapters, playing = false, currentChapter = 0 } }: PayloadAction<PlayerSetupPayload>
    ) => ({
      ...initialState,
      state: { ...initialState.state, playing, currentChapter },
      bookId,
      chapters,
    }),
    playerReset: () => initialState,
    // only chapters: a write to state would wake every position saver, see docs/ai/frontend/player.md
    updateChapters: (state, { payload }: PayloadAction<PlayerStore['chapters']>) => {
      state.chapters = payload;
    },
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
    updateSpeed: (store, { payload }: PayloadAction<number>) => {
      store.state.speed = payload;
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
    setDiagnostics: (store, { payload }: PayloadAction<boolean>) => {
      store.state.diagnostics = payload;
    },
    setError: (store, { payload }: PayloadAction<string>) => {
      store.state.error = payload;
    },
  },
});
export const {
  playerSetup,
  playerReset,
  updateChapters,
  setBookInfo,
  setPauseOnChapterEnd,
  setResetSleepTimerOnActivity,
  setPreventScreenLock,
  setDiagnostics,
} = playerSlice.actions;
