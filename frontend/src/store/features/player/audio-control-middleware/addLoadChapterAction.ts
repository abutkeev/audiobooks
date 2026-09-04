import { t } from 'i18next';
import type { AudioControllAddListrers } from '.';
import { changePosition } from '../actions';
import { playerReset, playerSlice } from '../slice';
import { loadChapter, retryChapter, startUpdates, stopUpdates } from '../internal';
import startPlayback from './startPlayback';
import waitForMetadata from './waitForMetadata';

const positionTolerance = 1;

const addLoadChapterAction: AudioControllAddListrers = (mw, audio) => {
  const { updateDuration, updatePosition, updatePlaying, setError, updateCurrentChapter } = playerSlice.actions;

  // the last request, for a retry to repeat: the store keeps a resolved position, and for a
  // chapter loading from its end that position is not the one the user asked for
  let pending: { request: { number: number; position?: number }; startPosition: number } | undefined;

  // playback outlives the effect that asked for it, so its failure has to be told from the
  // failure of a load that has already been replaced
  let currentLoad = 0;

  mw.startListening({
    actionCreator: loadChapter,
    effect: async ({ payload }, { getState, dispatch, cancelActiveListeners, signal }) => {
      const { chapters, state } = getState().player;
      const chapter = chapters[payload.number];

      if (!chapter) {
        console.error(`Chapter ${payload.number} is out of range`);
        return;
      }

      cancelActiveListeners();

      const load = (currentLoad += 1);
      const { playing } = state;
      const position = payload.position ?? state.position;

      // a negative position is counted from the end of the chapter: resolve it from the known
      // duration right away, otherwise the store keeps the position of the chapter left behind
      const startPosition = position >= 0 ? position : Math.max((chapter.duration ?? 0) + position, 0);

      pending = { request: payload, startPosition };

      dispatch(stopUpdates());
      dispatch(updateDuration(undefined));
      dispatch(updateCurrentChapter(payload.number));
      // a message from a previous failure would outlive it and make a playing chapter look broken
      dispatch(setError(''));

      // the order below is dictated by iOS background playback,
      // see docs/ai/frontend/player.md, "Переключение главы"
      const metadata = waitForMetadata(audio, signal);

      audio.src = chapter.filename;
      audio.load();

      dispatch(changePosition(startPosition));

      if (playing) {
        startPlayback(audio, dispatch, () => currentLoad === load);
        dispatch(startUpdates());
      }

      try {
        const duration = await metadata;

        // the book may have been closed while the chapter was loading
        if (!getState().player.bookId) return;

        const stored = getState().player.state.position;
        const wanted = stored !== startPosition ? stored : position >= 0 ? position : duration + position;
        const target = Math.min(Math.max(wanted, 0), duration);

        if (Math.abs(audio.currentTime - target) > positionTolerance) {
          dispatch(changePosition(target));
        } else {
          dispatch(updatePosition(audio.currentTime));
        }

        // after the position: a known duration lets the websocket send the state,
        // otherwise it would send the position of the previous chapter
        dispatch(updateDuration(duration));
      } catch (e) {
        if (signal.aborted || !getState().player.bookId) return;

        // playback was requested before the metadata, so the element may be sounding already
        audio.pause();
        dispatch(updatePlaying(false));
        dispatch(stopUpdates());
        dispatch(setError(t("Can't load chapter")));
        console.error(`Can't load chapter ${payload.number}`, e);
      }
    },
  });

  mw.startListening({
    actionCreator: retryChapter,
    effect: (_, { getState, dispatch }) => {
      const { currentChapter, position } = getState().player.state;

      if (!pending) {
        dispatch(loadChapter({ number: currentChapter }));
        return;
      }

      const moved = position !== pending.startPosition;

      dispatch(loadChapter(moved ? { number: pending.request.number, position } : pending.request));
    },
  });

  mw.startListening({
    actionCreator: playerReset,
    effect: () => {
      currentLoad += 1;
      pending = undefined;
    },
  });
};

export default addLoadChapterAction;
