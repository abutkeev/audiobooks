import { AudioControllAddListrers } from '.';
import { changePosition, rewind } from '..';
import { loadChapter } from '../internal';

const addRewindAction: AudioControllAddListrers = (mw) => {
  mw.startListening({
    actionCreator: rewind,
    effect: ({ payload }, { getState, dispatch }) => {
      if (payload < 0) return;

      const { position, currentChapter } = getState().player.state;

      if (payload <= position) {
        dispatch(changePosition(position - payload));
        return;
      }

      if (currentChapter === 0) {
        dispatch(changePosition(0));
        return;
      }

      dispatch(loadChapter({ number: currentChapter - 1, position:  position - payload }));
    },
  });
};

export default addRewindAction;
