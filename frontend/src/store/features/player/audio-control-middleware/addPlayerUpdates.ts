import type { AudioControllAddListrers } from '.';
import { playerSlice } from '../slice';
import { playbackStalled, startUpdates, stopUpdates } from '../internal';
import { getAudioCtx } from './gainGraph';

// a spare tick over the one that would do: a single reading equal to the previous one costs
// nothing to wait out, and a false alarm here would mute a sounding element
const stalledTicks = 3;

type StalledDispatch = (action: ReturnType<typeof playbackStalled>) => void;

const addPlayerUpdates: AudioControllAddListrers = (mw, audio) => {
  let intervalId: ReturnType<typeof setInterval> | undefined;
  let lastTime = 0;
  let sameTime = 0;
  let reported = false;
  const { updatePosition, updateDuration, updatePlaying } = playerSlice.actions;

  // an element that answered a play but got no audio session reports playing and stays put,
  // see docs/ai/frontend/player.md, "Молчащее воспроизведение"
  const stalled = (dispatch: StalledDispatch) => {
    const healthy =
      audio.paused || audio.readyState < HTMLMediaElement.HAVE_FUTURE_DATA || audio.currentTime !== lastTime;
    lastTime = audio.currentTime;

    if (healthy) {
      sameTime = 0;
      reported = false;
      return false;
    }

    sameTime += 1;
    if (sameTime < stalledTicks) return false;
    if (reported) return true;

    reported = true;
    dispatch(playbackStalled());
    // two cures for the two ways to stand still, both idempotent: a suspended context above 100%
    // of volume looks exactly the same, see the section above
    getAudioCtx()?.resume();
    audio.muted = true;
    audio.muted = false;

    return true;
  };

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
        // on its own line: the detector resets its own state and has to run every tick,
        // see docs/ai/frontend/player.md, "Молчащее воспроизведение"
        const standstill = stalled(dispatch);

        dispatch(updatePlaying(!audio.paused && !standstill));
      }, 1000);
    },
  });

  mw.startListening({
    actionCreator: stopUpdates,
    effect: () => {
      clearInterval(intervalId);
      intervalId = undefined;
      lastTime = 0;
      sameTime = 0;
      reported = false;
    },
  });
};

export default addPlayerUpdates;
