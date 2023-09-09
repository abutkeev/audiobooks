import { AudioControllAddListrers } from '.';
import { changeVolume, playerReset, playerSetup } from '..';
import { loadChapter, stopUpdates } from '../internal';

const addPlayerSetupActions: AudioControllAddListrers = (mw, audio) => {
  mw.startListening({
    actionCreator: playerSetup,
    effect: (_, { getState, dispatch }) => {
      const {
        chapters,
        state: { currentChapter, position, volume },
      } = getState().player;

      if (chapters.length === 0) return;

      dispatch(loadChapter({ number: currentChapter, position }));
      dispatch(changeVolume(volume));
    },
  });

  mw.startListening({
    actionCreator: playerReset,
    effect: (_, { dispatch }) => {
      audio.pause();
      dispatch(stopUpdates());
    },
  });
};

export default addPlayerSetupActions;
