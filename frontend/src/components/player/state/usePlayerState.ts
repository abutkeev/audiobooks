import { Dispatch, createContext, useEffect, useReducer } from 'react';
import { Book } from '../../../api/api';
import { AnyAction, PayloadAction, createSlice } from '@reduxjs/toolkit';
import { getSavedState, useSaveState } from './localStorageState';
import useAudioControl, { UpdateAudioControl } from './useAudioControl';

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
    updateAudio?: UpdateAudioControl;
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
      store.state.updateAudio = {
        chapter: {
          number: store.state.currentChapter,
          position: store.state.position,
          play: false,
        },
        volume: store.state.volume / 100,
      };
    },
    audioUpdated: (store, { payload }: PayloadAction<'chapter' | 'position' | 'playing' | 'volume'>) => {
      if (!store.state.updateAudio) return;
      store.state.updateAudio[payload] = undefined;
    },
    updatePlaying: (store, { payload }: PayloadAction<boolean>) => {
      store.state.playing = payload;
    },
    updatePosition: (store, { payload }: PayloadAction<number>) => {
      store.state.position = payload;
    },
    updateDuration: (store, { payload }: PayloadAction<number>) => {
      store.state.duration = payload;
    },
    chapterEnded: store => {
      store.state.position = 0;
      const { currentChapter } = store.state;
      if (currentChapter === store.chapters.length - 1) {
        store.state.playing = false;
        store.state.updateAudio = {
          chapter: {
            number: 0,
            position: 0,
            play: false,
          },
        };
        store.state.currentChapter = 0;
        return;
      }
      store.state.currentChapter += 1;
      store.state.updateAudio = {
        chapter: {
          number: store.state.currentChapter,
          position: 0,
          play: !store.state.pauseOnChapterEnd,
        },
      };

      if (store.state.pauseOnChapterEnd) {
        store.state.playing = false;
        store.state.pauseOnChapterEnd = false;
        return;
      }

      store.state.playing = true;
    },
    setPauseOnChapterEnd: (store, { payload }: PayloadAction<boolean>) => {
      store.state.pauseOnChapterEnd = payload;
    },
    changePosition: (store, { payload }: PayloadAction<number>) => {
      store.state.position = payload;
      store.state.updateAudio = { position: payload };
    },
    pause: store => {
      const rewind = 5;
      const newPosition = store.state.position > rewind ? store.state.position - rewind : 0;
      store.state.updateAudio = {
        playing: false,
        position: newPosition,
      };
    },
    play: store => {
      if (store.state.error) {
        store.state.error = '';
        store.state.playing = true;
        store.state.updateAudio = {
          chapter: {
            number: store.state.currentChapter,
            position: store.state.position,
            play: true,
          },
        };
        return;
      }
      store.state.updateAudio = { playing: true };
    },
    forward: (store, { payload }: PayloadAction<number>) => {
      if (store.state.duration === undefined) return;
      const remainTime = store.state.duration - store.state.position;
      if (payload <= remainTime) {
        store.state.position += payload;
        store.state.updateAudio = { position: store.state.position };
        return;
      }
      if (store.state.currentChapter === store.chapters.length - 1) {
        store.state.position = store.state.duration;
        store.state.updateAudio = { position: store.state.position };
        return;
      }
      store.state.currentChapter += 1;
      store.state.updateAudio = {
        chapter: {
          number: store.state.currentChapter,
          position: payload - remainTime,
          play: store.state.playing,
        },
      };
    },
    rewind: (store, { payload }: PayloadAction<number>) => {
      if (payload < 0) return;
      if (payload <= store.state.position) {
        store.state.position -= payload;
        store.state.updateAudio = { position: store.state.position };
        return;
      }
      if (store.state.currentChapter === 0) {
        store.state.position = 0;
        store.state.updateAudio = { position: store.state.position };
        return;
      }
      const remainingRewind = payload - store.state.position;
      store.state.currentChapter -= 1;
      store.state.updateAudio = {
        chapter: {
          number: store.state.currentChapter,
          position: -remainingRewind,
          play: store.state.playing,
        },
      };
      store.state.duration = undefined;
    },
    chapterChange: (store, { payload }: PayloadAction<number>) => {
      store.state.position = 0;
      store.state.currentChapter = payload;
      store.state.updateAudio = {
        chapter: {
          number: store.state.currentChapter,
          position: 0,
          play: store.state.playing,
        },
      };
    },
    changeVolume: (store, { payload }: PayloadAction<number>) => {
      store.state.volume = payload;
      store.state.updateAudio = { volume: payload / 100 };
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
  forward,
  rewind,
  chapterChange,
  changeVolume,
  pause,
  play,
  setPauseOnChapterEnd,
  setResetSleepTimerOnActivity,
  setPreventScreenLock,
} = playerSlice.actions;

const usePlayerState = (bookId: string, chapters: PlayerStore['chapters']) => {
  const [{ state }, dispatch] = useReducer(playerSlice.reducer, playerSlice.getInitialState(), initialState => {
    const state = getSavedState(initialState.state, bookId, chapters.length);
    return { state, chapters, bookId };
  });

  const { setup, audioUpdated, chapterEnded, updatePlaying, updatePosition, updateDuration, setError } =
    playerSlice.actions;
  const { updateAudio } = state;
  useAudioControl({
    chapters,
    updateAudio,
    dispatch,
    actions: {
      audioUpdated,
      updatePlaying,
      updatePosition,
      updateDuration,
      chapterEnded,
      setError,
    },
  });
  useEffect(() => {
    dispatch(setup({ bookId, chapters }));
  }, [bookId, chapters]);

  useSaveState(state, bookId);

  return [state, dispatch] as const;
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
