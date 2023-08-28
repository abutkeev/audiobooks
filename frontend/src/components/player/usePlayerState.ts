import { Dispatch, createContext, useEffect, useReducer, useRef } from 'react';
import { Book } from '../../api/api';
import { AnyAction, PayloadAction, createSlice } from '@reduxjs/toolkit';
import { getSavedState, useSaveState } from './localStorageState';

let audioRef: React.RefObject<HTMLAudioElement> | null;

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
  chapters: Book['chapters'];
}

export type PlayerState = PlayerStore['state'];

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
  chapters: [],
};

const updateSrc = (bookId: string, chapters: PlayerStore['chapters'], chapter: number) => {
  if (!audioRef || !audioRef.current) return;
  audioRef.current.src = `/api/books/${bookId}/${chapters[chapter].filename}`;
};

const playOnReady = ({ target }: Event) => {
  if (target instanceof HTMLAudioElement) {
    target.play();
    target.removeEventListener('canplay', playOnReady);
  }
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setup: (
      store,
      { payload: { bookId, chapters } }: PayloadAction<{ bookId: string; chapters: PlayerStore['chapters'] }>
    ) => {
      store.state = getSavedState(initialState.state, bookId, chapters.length);
      store.chapters = chapters;
      if (!audioRef || !audioRef.current) return;
      updateSrc(bookId, chapters, store.state.currentChapter);
      audioRef.current.currentTime = store.state.position;
      audioRef.current.volume = store.state.volume / 100;
    },
    updateDuration: store => {
      if (!audioRef || !audioRef.current) return;
      store.state.duration = audioRef.current.duration;
    },
    setPlaying: (store, { payload }: PayloadAction<boolean>) => {
      store.state.playing = payload;
    },
    chapterEnded: store => {
      store.state.position = 0;
      const { currentChapter } = store.state;
      if (currentChapter === store.chapters.length - 1) {
        updateSrc(store.bookId, store.chapters, 0);
        store.state.currentChapter = 0;
        return;
      }
      const newChapter = store.state.currentChapter + 1;
      store.state.currentChapter = newChapter;
      updateSrc(store.bookId, store.chapters, newChapter);
      if (store.state.pauseOnChapterEnd) {
        store.state.pauseOnChapterEnd = false;
        return;
      }
      audioRef?.current?.addEventListener('canplay', playOnReady);
    },
    setPauseOnChapterEnd: (store, { payload }: PayloadAction<boolean>) => {
      store.state.pauseOnChapterEnd = payload;
    },
    updatePosition: store => {
      if (!audioRef || !audioRef.current) return;
      store.state.position = audioRef.current.currentTime;
    },
    changePosition: (store, { payload }: PayloadAction<number>) => {
      if (!audioRef || !audioRef.current) return;
      store.state.position = payload;
      audioRef.current.currentTime = payload;
    },
    pause: () => {
      audioRef?.current?.pause();
    },
    playPause: store => {
      if (!audioRef || !audioRef.current) return;
      if (store.state.playing) {
        const rewind = 5;
        const newPosition = store.state.position > rewind ? store.state.position - rewind : 0;
        audioRef.current.pause();
        store.state.position = newPosition;
        audioRef.current.currentTime = newPosition;
        return;
      }
      if (store.state.error) {
        store.state.error = '';
        updateSrc(store.bookId, store.chapters, store.state.currentChapter);
        audioRef.current.addEventListener('canplay', playOnReady);
        return;
      }
      audioRef.current.play();
    },
    chapterChange: (store, { payload }: PayloadAction<number>) => {
      if (!audioRef || !audioRef.current || payload < 0 || payload > store.chapters.length - 1) return;
      store.state.position = 0;
      store.state.currentChapter = payload;
      updateSrc(store.bookId, store.chapters, payload);
      if (store.state.playing) {
        audioRef.current.addEventListener('canplay', playOnReady);
      }
    },
    changeVolume: (store, { payload }: PayloadAction<number>) => {
      if (!audioRef || !audioRef.current || payload < 0 || payload > 100) return;
      store.state.volume = payload;
      audioRef.current.volume = payload / 100;
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
  changePosition,
  playPause,
  chapterChange,
  changeVolume,
  pause,
  setPauseOnChapterEnd,
  setResetSleepTimerOnActivity,
  setPreventScreenLock,
} = playerSlice.actions;

const usePlayerState = (bookId: string, chapters: PlayerStore['chapters']) => {
  audioRef = useRef<HTMLAudioElement>(null);
  const [{ state }, dispatch] = useReducer(playerSlice.reducer, playerSlice.getInitialState(), initialState => {
    const state = getSavedState(initialState.state, bookId, chapters.length);
    return { state, chapters, bookId };
  });

  const { setup, updateDuration, setPlaying, chapterEnded, updatePosition, setError } = playerSlice.actions;
  useEffect(() => {
    dispatch(setup({ bookId, chapters }));
    if (!audioRef || !audioRef.current) return;
    audioRef.current.oncanplay = () => dispatch(updateDuration());
    audioRef.current.onplaying = () => dispatch(setPlaying(true));
    audioRef.current.onpause = () => dispatch(setPlaying(false));
    audioRef.current.onended = () => dispatch(chapterEnded());
    audioRef.current.onerror = e => {
      dispatch(setPlaying(false));
      if (typeof e === 'string') {
        dispatch(setError(e));
        return;
      }
      console.error(e);
      dispatch(setError('An error occurred, see console log for details'));
    };
    const intervalId = setInterval(() => dispatch(updatePosition), 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [bookId, chapters]);

  useSaveState(state, bookId);

  return [{ state, audioRef }, dispatch] as const;
};

const defaultContextData: {
  state: PlayerStore['state'];
  chapters: PlayerStore['chapters'];
  dispatch: Dispatch<AnyAction>;
} = {
  state: initialState.state,
  dispatch: () => {},
  chapters: [],
};

export const PlayerStateContext = createContext(defaultContextData);

export default usePlayerState;
