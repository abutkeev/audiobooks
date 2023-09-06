import { Dispatch, createContext, useEffect, useReducer } from 'react';
import { Book } from '../../../api/api';
import { AnyAction, PayloadAction, createSlice } from '@reduxjs/toolkit';
import { getSavedState, useSaveState } from './localStorageState';
import useAudioControl, { UpdateAudioControl } from './useAudioControl';
import useCache from './useCache';

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
    updateBookState?: {
      bookId: string;
      currentChapter: number;
      position: number;
    };
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

export type ExternalPlayerState = PlayerPosition;

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setup: (
      store,
      {
        payload: { bookId, chapters, externalState },
      }: PayloadAction<{ bookId: string; chapters: PlayerStore['chapters']; externalState?: ExternalPlayerState }>
    ) => {
      store.state = getSavedState(initialState.state, bookId, chapters.length);
      if (externalState) {
        const { currentChapter, position } = externalState;
        store.state.currentChapter = currentChapter;
        store.state.position = position;
      }
      store.bookId = bookId;
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
    updateBookState: (store, { payload }: PayloadAction<PlayerState['updateBookState']>) => {
      if (!payload || store.bookId !== payload.bookId) {
        store.state.updateBookState = payload;
        return;
      }

      const { position, currentChapter } = payload;

      if (position < 0) return;

      if (store.state.currentChapter === currentChapter) {
        if (store.state.duration && position > store.state.duration) return;
        store.state.playing = false;
        store.state.position = position;
        store.state.updateAudio = { playing: false, position: position };
        return;
      }

      if (currentChapter >= store.chapters.length) return;

      store.state.playing = false;
      store.state.currentChapter = currentChapter;
      store.state.position = position;

      store.state.updateAudio = {
        chapter: {
          number: currentChapter,
          position: position,
          play: false,
        },
      };
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
  updateBookState,
} = playerSlice.actions;

const usePlayerState = (
  bookId: string,
  chapters: PlayerStore['chapters'],
  externalState: ExternalPlayerState | undefined,
  onStateUpdate: (state: PlayerState) => void
) => {
  const [{ state }, dispatch] = useReducer(playerSlice.reducer, playerSlice.getInitialState(), initialState => {
    const state = getSavedState(initialState.state, bookId, chapters.length);
    return { state, chapters, bookId };
  });

  const {
    setup,
    audioUpdated,
    chapterEnded,
    updatePlaying,
    updatePosition,
    updateDuration,
    setError,
    updateBookState,
  } = playerSlice.actions;
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
    dispatch(setup({ bookId, chapters, externalState }));
  }, [bookId, chapters]);

  useEffect(() => onStateUpdate(state), [state]);

  useSaveState(state, bookId);

  useEffect(() => {
    if (state.updateBookState) {
      dispatch(updateBookState());
    }
  }, [state.updateBookState]);

  return [state, dispatch] as const;
};

export interface PlayerPosition {
  currentChapter: number;
  position: number;
}

const defaultContextData: {
  state: PlayerStore['state'];
  bookId: string;
  chapters: PlayerStore['chapters'];
  dispatch: Dispatch<AnyAction>;
  generateUrl(state: PlayerPosition): string;
  cache: ReturnType<typeof useCache>;
} = {
  state: initialState.state,
  bookId: '',
  dispatch: () => {},
  chapters: [],
  generateUrl: () => '',
  cache: { state: [], dispatch: () => {}, clearCache: async () => {} },
};

export const PlayerStateContext = createContext(defaultContextData);

export default usePlayerState;
