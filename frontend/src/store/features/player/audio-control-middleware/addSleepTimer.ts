import { throttle } from 'throttle-debounce';
import type { AudioControllAddListrers } from '.';
import { pause } from '../actions';
import { clearSleepTimer, extendSleepTimer, playerReset, setSleepTimer } from '../slice';

const tickInterval = 1000;
// the timer is extended on every mouse move, and a dispatch per move would flood the subscribers
const extendInterval = 5000;

/** Counts the evening down, see docs/ai/frontend/player.md, "Таймер сна". */
const addSleepTimer: AudioControllAddListrers = mw => {
  let intervalId: ReturnType<typeof setInterval> | undefined;
  let removeActivityListeners: (() => void) | undefined;

  const stop = () => {
    clearInterval(intervalId);
    intervalId = undefined;
    removeActivityListeners?.();
    removeActivityListeners = undefined;
  };

  mw.startListening({
    actionCreator: setSleepTimer,
    effect: (_, { dispatch, getState }) => {
      stop();

      const extend = throttle(extendInterval, () => dispatch(extendSleepTimer()));
      const onActivity = () => {
        if (getState().player.state.resetSleepTimerOnActivity) extend();
      };

      window.addEventListener('mousemove', onActivity);
      window.addEventListener('keydown', onActivity);
      removeActivityListeners = () => {
        window.removeEventListener('mousemove', onActivity);
        window.removeEventListener('keydown', onActivity);
      };

      intervalId = setInterval(() => {
        const { sleepTimer, state } = getState().player;

        if (!sleepTimer || Date.now() < sleepTimer.endsAt) return;

        // a pause over a player already stopped would move its position five seconds back
        if (state.playing) dispatch(pause());

        dispatch(clearSleepTimer());
      }, tickInterval);
    },
  });

  mw.startListening({
    predicate: action => clearSleepTimer.match(action) || playerReset.match(action),
    effect: () => stop(),
  });
};

export default addSleepTimer;
