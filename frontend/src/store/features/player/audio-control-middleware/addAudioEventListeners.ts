import { t } from 'i18next';
import type { AudioControllAddListrers } from '.';
import { playerSetup, playerSlice } from '../slice';
import { chapterEnded, retryChapter, startUpdates, stopUpdates } from '../internal';
import { getAudioCtx } from './gainGraph';

const addAudioEventListeners: AudioControllAddListrers = (mw, audio) => {
  const { updatePlaying, setError } = playerSlice.actions;
  mw.startListening({
    actionCreator: playerSetup,
    effect: (_, { dispatch, getState, unsubscribe }) => {
      // the element leads and the store follows, see docs/ai/frontend/player.md, "Заморозка"
      audio.onplaying = () => {
        if (!getState().player.bookId) return;

        getAudioCtx()?.resume();
        dispatch(updatePlaying(true));
        dispatch(startUpdates());
      };
      audio.onplay = () => {
        // the lock screen reaches the element, not the store, see docs/ai/frontend/player.md, "Заморозка"
        if (!getState().player.state.error) return;

        dispatch(updatePlaying(true));
        dispatch(retryChapter());
      };
      audio.onpause = () => {
        // a pause reported to an element without data belongs to the load,
        // see docs/ai/frontend/player.md, "Переключение главы"
        if (audio.readyState === HTMLMediaElement.HAVE_NOTHING) return;

        dispatch(updatePlaying(false));
        dispatch(stopUpdates());
      };
      audio.onended = () => dispatch(chapterEnded());
      audio.onerror = () => {
        // a failed load is reported by addLoadChapterAction: one error, one message
        if (audio.readyState === HTMLMediaElement.HAVE_NOTHING) return;

        const { bookId, state } = getState().player;
        if (!bookId) return;

        console.error(`Media error in chapter ${state.currentChapter}`, audio.error?.code, audio.error?.message);
        // a fatal error leaves the element unpaused, and then it answers no request to play
        audio.pause();
        dispatch(updatePlaying(false));
        dispatch(stopUpdates());
        dispatch(setError(t("Can't play chapter")));
      };
      unsubscribe();
    },
  });
};

export default addAudioEventListeners;
