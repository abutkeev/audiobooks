import { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { t } from 'i18next';
import { showMessage } from '../actions';
import { playerSlice } from '../slice';
import { stopUpdates } from '../internal';

type Dispatch = ThunkDispatch<unknown, unknown, UnknownAction>;

// play() rejects silently otherwise, leaving the store playing with no sound
const startPlayback = (audio: HTMLAudioElement, dispatch: Dispatch, isCurrent?: () => boolean) => {
  const { updatePlaying, setError } = playerSlice.actions;

  audio.play().catch((e: DOMException) => {
    // the load this playback belonged to has been replaced, or it failed and reported itself
    if (isCurrent?.() === false || audio.error || e.name === 'AbortError') return;

    dispatch(updatePlaying(false));
    dispatch(stopUpdates());

    if (e.name === 'NotAllowedError') {
      dispatch(showMessage({ text: t('Playback was blocked, press play to continue'), severity: 'warning' }));
      return;
    }

    dispatch(setError(t("Can't play chapter")));
    console.error("Can't play chapter", e);
  });
};

export default startPlayback;
