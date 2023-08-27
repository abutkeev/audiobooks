import { Dispatch, createContext, useEffect, useReducer, useRef } from 'react';
import { Book } from '../../api/api';
import { AnyAction, PayloadAction, createSlice } from '@reduxjs/toolkit';

const localStorageStateName = 'playerState';
interface PlayerStore {
  state: {
    currentChapter: number;
    position: number;
    volume: number;
    duration?: number;
    playing: boolean;
  };
  audioRef: React.RefObject<HTMLAudioElement> | null;
  bookId: string;
  chapters: Book['chapters'];
}
const initialState: PlayerStore = {
  state: {
    currentChapter: 0,
    position: 0,
    volume: 100,
    duration: undefined,
    playing: false,
  },
  audioRef: null,
  bookId: '',
  chapters: [],
};

const getSavedState = (initialState: PlayerStore['state'], bookId: string) => {
  const state = { ...initialState };
  const savedState = localStorage.getItem(localStorageStateName);
  if (!savedState) return state;
  try {
    const { currentChapter, position, bookId: savedBookId, volume } = JSON.parse(savedState);
    if (isFinite(volume) && volume > 0 && volume < 100) {
      state.volume = volume;
    }

    if (savedBookId !== bookId) return state;
    if (isFinite(currentChapter) && currentChapter > 0) {
      state.currentChapter = currentChapter;
    }
    if (isFinite(position) && position > 0) {
      state.position = position;
    }
  } catch (e) {
    console.error("Can't parse state", e);
  }
  return state;
};

const updateSrc = (
  audioRef: PlayerStore['audioRef'],
  bookId: string,
  chapters: PlayerStore['chapters'],
  chapter: number
) => {
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
      store.state = getSavedState(initialState.state, bookId);
      store.chapters = chapters;
      if (!store.audioRef || !store.audioRef.current) return;
      updateSrc(store.audioRef as PlayerStore['audioRef'], bookId, chapters, store.state.currentChapter);
      store.audioRef.current.currentTime = store.state.position;
      store.audioRef.current.volume = store.state.volume / 100;
    },
    updateDuration: store => {
      if (!store.audioRef || !store.audioRef.current) return;
      store.state.duration = store.audioRef.current.duration;
    },
    setPlaying: (store, { payload }: PayloadAction<boolean>) => {
      store.state.playing = payload;
    },
    chapterEnded: store => {
      store.state.position = 0;
      const { currentChapter } = store.state;
      if (currentChapter === store.chapters.length - 1) {
        updateSrc(store.audioRef as PlayerStore['audioRef'], store.bookId, store.chapters, 0);
        store.state.currentChapter = 0;
        return;
      }
      const newChapter = store.state.currentChapter + 1;
      store.state.currentChapter = newChapter;
      updateSrc(store.audioRef as PlayerStore['audioRef'], store.bookId, store.chapters, newChapter);
      store.audioRef?.current?.addEventListener('canplay', playOnReady);
    },
    updatePosition: store => {
      if (!store.audioRef || !store.audioRef.current) return;
      store.state.position = store.audioRef.current.currentTime;
    },
    changePosition: (store, { payload }: PayloadAction<number>) => {
      if (!store.audioRef || !store.audioRef.current) return;
      store.state.position = payload;
      store.audioRef.current.currentTime = payload;
    },
    playPause: ({ state, audioRef }) => {
      if (!audioRef || !audioRef.current) return;
      if (state.playing) {
        audioRef.current.pause();
        return;
      }
      audioRef.current.play();
    },
    chapterChange: (store, { payload }: PayloadAction<number>) => {
      if (!store.audioRef || !store.audioRef.current || payload < 0 || payload > store.chapters.length - 1) return;
      store.state.position = 0;
      store.state.currentChapter = payload;
      updateSrc(store.audioRef as PlayerStore['audioRef'], store.bookId, store.chapters, payload);
      if (store.state.playing) {
        store.audioRef.current.addEventListener('canplay', playOnReady);
      }
    },
    changeVolume: (store, { payload }: PayloadAction<number>) => {
      if (!store.audioRef || !store.audioRef.current || payload < 0 || payload > 100) return;
      store.state.volume = payload;
      store.audioRef.current.volume = payload / 100;
    },
  },
});
export const { changePosition, playPause, chapterChange, changeVolume } = playerSlice.actions;

const usePlayerState = (bookId: string, chapters: PlayerStore['chapters']) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [{ state }, dispatch] = useReducer(playerSlice.reducer, playerSlice.getInitialState(), initialState => {
    const state = getSavedState(initialState.state, bookId);
    return { state, chapters, audioRef, bookId };
  });

  const { setup, updateDuration, setPlaying, chapterEnded, updatePosition } = playerSlice.actions;
  useEffect(() => {
    dispatch(setup({ bookId, chapters }));
    if (!audioRef.current) return;
    audioRef.current.oncanplay = () => dispatch(updateDuration());
    audioRef.current.onplaying = () => dispatch(setPlaying(true));
    audioRef.current.onpause = () => dispatch(setPlaying(false));
    audioRef.current.onended = () => dispatch(chapterEnded());
    const intervalId = setInterval(() => dispatch(updatePosition), 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [bookId, chapters]);

  const { currentChapter, position, volume } = state;
  useEffect(() => {
    localStorage.setItem(
      localStorageStateName,
      JSON.stringify({ bookId, currentChapter, position, volume, updated: new Date().toISOString() })
    );
  }, [bookId, currentChapter, position, volume]);

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
