import type { AudioControllAddListrers } from '.';
import { getAudioCtx } from './gainGraph';
import { pause, play } from '../actions';
import { playerSlice } from '../slice';
import { retryChapter, startUpdates, stopUpdates } from '../internal';
import startPlayback from './startPlayback';

const addPlayPauseActions: AudioControllAddListrers = (mw, audio) => {
  const { updatePosition, updatePlaying } = playerSlice.actions;

  mw.startListening({
    actionCreator: pause,
    effect: (_, { getState, dispatch }) => {
      const { position } = getState().player.state;
      const rewind = 5;
      const newPosition = position > rewind ? position - rewind : 0;

      audio.currentTime = newPosition;
      audio.pause();

      dispatch(updatePosition(newPosition));
      dispatch(updatePlaying(false));
      dispatch(stopUpdates());
    },
  });

  mw.startListening({
    actionCreator: play,
    effect: (_, { dispatch, getState }) => {
      const { error, duration } = getState().player.state;

      dispatch(updatePlaying(true));
      // kept on the action and not only on the playing event: chrome resumes a context
      // only inside a gesture, see docs/ai/frontend/player.md, "Web Audio API"
      getAudioCtx()?.resume();

      // play over a chapter without metadata is an explicit retry: the element gives no way
      // to tell a stalled load from a live one. Reloading starts the playback on its own
      if (error || duration === undefined) {
        dispatch(retryChapter());
        return;
      }

      dispatch(startUpdates());
      startPlayback(audio, dispatch);
    },
  });
};

export default addPlayPauseActions;
