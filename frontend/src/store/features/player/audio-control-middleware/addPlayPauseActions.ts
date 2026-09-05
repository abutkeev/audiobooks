import type { AudioControllAddListrers } from '.';
import { getAudioCtx } from './gainGraph';
import { pause, play } from '../actions';
import { playerSlice } from '../slice';
import { retryChapter, startUpdates, stopUpdates } from '../internal';
import startPlayback from './startPlayback';

const rewindTime = 5;

const addPlayPauseActions: AudioControllAddListrers = (mw, audio) => {
  const { updatePosition, updatePlaying } = playerSlice.actions;

  mw.startListening({
    actionCreator: pause,
    effect: (_, { getState, dispatch }) => {
      const { position, rewindOnPause } = getState().player.state;
      const newPosition = rewindOnPause ? Math.max(position - rewindTime, 0) : position;

      // the seek goes before the pause, and on a hidden page it may be what costs the element the
      // right to sound again, see docs/ai/frontend/player.md, "Заморозка"
      if (newPosition !== position) {
        audio.currentTime = newPosition;
        dispatch(updatePosition(newPosition));
      }

      audio.pause();
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
