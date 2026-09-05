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

const minute = 60 * 1000;

export interface PlayerSetupPayload {
  bookId: string;
  chapters: BookChapter[];
  playing?: boolean;
  /** A chapter chosen by the user: the saved one is not restored over it. */
  currentChapter?: number;
}

interface SleepTimer {
  endsAt: number;
  minutes: number;
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
  // next to state, not inside it, see docs/ai/frontend/player.md, "Таймер сна"
  sleepTimer?: SleepTimer;
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
  sleepTimer: undefined,
};

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    // the sleep timer survives a book change, see docs/ai/frontend/player.md, "Таймер сна"
    playerSetup: (
      { sleepTimer },
      { payload: { bookId, chapters, playing = false, currentChapter = 0 } }: PayloadAction<PlayerSetupPayload>
    ) => ({
      ...initialState,
      state: { ...initialState.state, playing, currentChapter },
      bookId,
      chapters,
      sleepTimer,
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
    // the clock is read in prepare, so that the reducer itself stays pure
    setSleepTimer: {
      reducer: (store, { payload: { minutes, now } }: PayloadAction<{ minutes: number; now: number }>) => {
        store.sleepTimer = { minutes, endsAt: now + minutes * minute };
      },
      prepare: (minutes: number) => ({ payload: { minutes, now: Date.now() } }),
    },
    // separate from setSleepTimer: the listener restarts on that one, and restarting it on every
    // extension would reset the throttle that limits them
    extendSleepTimer: {
      reducer: (store, { payload: now }: PayloadAction<number>) => {
        if (!store.sleepTimer) return;

        store.sleepTimer.endsAt = now + store.sleepTimer.minutes * minute;
      },
      prepare: () => ({ payload: Date.now() }),
    },
    clearSleepTimer: store => {
      store.sleepTimer = undefined;
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
  setSleepTimer,
  extendSleepTimer,
  clearSleepTimer,
} = playerSlice.actions;
