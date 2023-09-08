import { AudioControllAddListrers } from '.';
import { changePosition, forward } from '..';
import { loadChapter } from '../internal';

const addForwardAction: AudioControllAddListrers = mw => {
  mw.startListening({
    actionCreator: forward,
    effect: ({ payload }, { getState, dispatch }) => {
      const { position, currentChapter, duration } = getState().player.state;

      if (payload < 0 || duration === undefined) return;

      const remainTime = duration - position;

      if (payload <= remainTime) {
        dispatch(changePosition(position + payload));
        return;
      }

      if (currentChapter === getState().player.chapters.length - 1) {
        dispatch(changePosition(duration));
        return;
      }

      dispatch(loadChapter({ number: currentChapter + 1, position: payload - remainTime }));
    },
  });
};

export default addForwardAction;
