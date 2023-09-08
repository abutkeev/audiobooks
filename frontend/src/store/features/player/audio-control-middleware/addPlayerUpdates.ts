import { AudioControllAddListrers } from '.';
import { playerSlice } from '..';
import { startUpdates, stopUpdates } from '../internal';

const addPlayerUpdates: AudioControllAddListrers = (mw, audio) => {
  let intervalId: ReturnType<typeof setInterval>;
  const { updatePosition, updateDuration, updatePlaying } = playerSlice.actions;

  mw.startListening({
    actionCreator: startUpdates,
    effect: (_, { dispatch }) => {
      intervalId = setInterval(() => {
        dispatch(updatePosition(audio.currentTime));
        dispatch(updateDuration(audio.duration));
        dispatch(updatePlaying(!audio.paused));
      }, 1000);
    },
  });

  mw.startListening({
    actionCreator: stopUpdates,
    effect: () => {
      clearInterval(intervalId);
    },
  });
};

export default addPlayerUpdates;
