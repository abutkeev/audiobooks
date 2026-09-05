import type { AudioControllAddListrers } from '.';
import { playerSlice } from '../slice';
import { startUpdates, stopUpdates } from '../internal';

const addPlayerUpdates: AudioControllAddListrers = (mw, audio) => {
  let intervalId: ReturnType<typeof setInterval> | undefined;
  const { updatePosition, updateDuration, updatePlaying } = playerSlice.actions;

  mw.startListening({
    actionCreator: startUpdates,
    effect: (_, { dispatch, getState }) => {
      // idempotent on purpose: playback resumed after buffering asks again, and restarting the
      // timer would put off the next publication by a whole second every time
      if (intervalId) return;

      intervalId = setInterval(() => {
        // a loading element would overwrite the position the chapter starts from; the store
        // duration is set by loadChapter after that position, see docs/ai/frontend/player.md
        if (getState().player.state.duration !== undefined) {
          if (audio.readyState === HTMLMediaElement.HAVE_NOTHING) {
            // the element lost its resource: without dropping the duration play would see a
            // loaded chapter and start it over instead of repeating the request
            dispatch(updateDuration(undefined));
          } else {
            dispatch(updatePosition(audio.currentTime));
            if (isFinite(audio.duration)) dispatch(updateDuration(audio.duration));
          }
        }
        dispatch(updatePlaying(!audio.paused));
      }, 1000);
    },
  });

  mw.startListening({
    actionCreator: stopUpdates,
    effect: () => {
      clearInterval(intervalId);
      intervalId = undefined;
    },
  });
};

export default addPlayerUpdates;
