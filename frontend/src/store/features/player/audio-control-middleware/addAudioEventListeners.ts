import { t } from 'i18next';
import type { AudioControllAddListrers } from '.';
import { playerSetup, playerSlice } from '../slice';
import { chapterEnded, stopUpdates } from '../internal';

const addAudioEventListeners: AudioControllAddListrers = (mw, audio) => {
  const { updatePlaying, setError } = playerSlice.actions;
  mw.startListening({
    actionCreator: playerSetup,
    effect: (_, { dispatch, getState, unsubscribe }) => {
      audio.onplaying = () => dispatch(updatePlaying(true));
      audio.onpause = () => {
        // a pause reported to an element without data belongs to the load,
        // see docs/ai/frontend/player.md, "Переключение главы"
        if (audio.readyState === HTMLMediaElement.HAVE_NOTHING) return;

        dispatch(updatePlaying(false));
      };
      audio.onended = () => dispatch(chapterEnded());
      audio.onerror = () => {
        // a failed load is reported by addLoadChapterAction: one error, one message
        if (audio.readyState === HTMLMediaElement.HAVE_NOTHING) return;

        const { bookId, state } = getState().player;
        if (!bookId) return;

        console.error(`Media error in chapter ${state.currentChapter}`, audio.error?.code, audio.error?.message);
        dispatch(updatePlaying(false));
        dispatch(stopUpdates());
        dispatch(setError(t("Can't play chapter")));
      };
      unsubscribe();
    },
  });
};

export default addAudioEventListeners;
