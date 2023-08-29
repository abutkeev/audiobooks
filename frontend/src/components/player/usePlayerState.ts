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
    newPosition?: number;
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
    canPlay: store => {
      if (!audioRef || !audioRef.current) return;
      store.state.duration = audioRef.current.duration;
      if (store.state.newPosition) {
        if (store.state.newPosition < 0) {
          const newPosition = store.state.duration - store.state.newPosition;
          store.state.position = newPosition > 0 ? newPosition : 0;
        } else {
          store.state.position =
            store.state.newPosition < store.state.duration ? store.state.newPosition : store.state.duration;
        }
        audioRef.current.currentTime = store.state.position;
        store.state.newPosition = undefined;
      }
      if (store.state.playing) audioRef.current.play();
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
      store.state.playing = true;
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
        store.state.playing = true;
        updateSrc(store.bookId, store.chapters, store.state.currentChapter);
        return;
      }
      audioRef.current.play();
    },
    forward: (store, { payload }: PayloadAction<number>) => {
      if (!audioRef || !audioRef.current || payload < 0 || store.state.duration === undefined) return;
      const remainTime = store.state.duration - store.state.position;
      if (payload <= remainTime) {
        store.state.position += payload;
        audioRef.current.currentTime = store.state.position;
        return;
      }
      if (store.state.currentChapter === store.chapters.length - 1) {
        store.state.position = store.state.duration;
        audioRef.current.currentTime = store.state.duration;
        return;
      }
      store.state.currentChapter += 1;
      updateSrc(store.bookId, store.chapters, store.state.currentChapter);
      store.state.newPosition = payload - remainTime;
    },
    rewind: (store, { payload }: PayloadAction<number>) => {
      if (!audioRef || !audioRef.current || payload < 0) return;
      if (payload <= store.state.position) {
        store.state.position -= payload;
        audioRef.current.currentTime = store.state.position;
        return;
      }
      if (store.state.currentChapter === 0) {
        store.state.position = 0;
        audioRef.current.currentTime = 0;
        return;
      }
      const remainingRewind = payload - store.state.position;
      store.state.currentChapter -= 1;
      updateSrc(store.bookId, store.chapters, store.state.currentChapter);
      store.state.newPosition = -remainingRewind;
      store.state.duration = undefined;
    },
    chapterChange: (store, { payload }: PayloadAction<number>) => {
      if (!audioRef || !audioRef.current || payload < 0 || payload > store.chapters.length - 1) return;
      store.state.position = 0;
      store.state.currentChapter = payload;
      updateSrc(store.bookId, store.chapters, payload);
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
  forward,
  rewind,
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

  const { setup, canPlay, setPlaying, chapterEnded, updatePosition, setError } = playerSlice.actions;
  useEffect(() => {
    dispatch(setup({ bookId, chapters }));
    if (!audioRef || !audioRef.current) return;
    audioRef.current.oncanplay = () => dispatch(canPlay());
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
