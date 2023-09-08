import { AudioControllAddListrers } from '.';
import { pause, play, playerSlice } from '..';
import { loadChapter, startUpdates, stopUpdates } from '../internal';

const addPlayPauseActions: AudioControllAddListrers = (mw, audio) => {
  const { updatePosition, updatePlaying, setError } = playerSlice.actions;

  mw.startListening({
    actionCreator: pause,
    effect: (_, { getState, dispatch }) => {
      const { position } = getState().player.state;
      const rewind = 5;
      const newPosition = position > rewind ? position - rewind : 0;

      audio.pause();
      audio.currentTime = newPosition;

      dispatch(updatePosition(newPosition));
      dispatch(updatePlaying(false));
      dispatch(stopUpdates());
    },
  });

  mw.startListening({
    actionCreator: play,
    effect: (_, { dispatch, getState }) => {
      const { error, currentChapter } = getState().player.state;
      if (error) {
        dispatch(setError(''));
        dispatch(loadChapter({ number: currentChapter }));
      }
      dispatch(updatePlaying(true));
      dispatch(startUpdates());
      audio.play();
    },
  });
};

export default addPlayPauseActions;
