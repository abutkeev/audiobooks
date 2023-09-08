import { AudioControllAddListrers } from '.';
import { playerSlice, playerSetup } from '..';
import { chapterEnded } from '../internal';

const addAudioEventListeners: AudioControllAddListrers = (mw, audio) => {
  const { updateDuration, updatePlaying, setError } = playerSlice.actions;
  mw.startListening({
    actionCreator: playerSetup,
    effect: (_, { dispatch, unsubscribe }) => {
      audio.oncanplay = () => dispatch(updateDuration(audio.duration));
      audio.onplaying = () => dispatch(updatePlaying(true));
      audio.onpause = () => dispatch(updatePlaying(false));
      audio.onended = () => dispatch(chapterEnded());
      audio.onerror = e => {
        dispatch(updatePlaying(false));
        if (typeof e === 'string') {
          dispatch(setError(e));
          return;
        }
        console.error(e);
        dispatch(setError('An error occurred, see console log for details'));
      };
      unsubscribe();
    },
  });
};

export default addAudioEventListeners;
