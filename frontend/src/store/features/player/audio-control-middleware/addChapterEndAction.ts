import { AudioControllAddListrers } from '.';
import { playerSlice, setPauseOnChapterEnd } from '..';
import { chapterEnded, loadChapter } from '../internal';

const addChapterEndAction: AudioControllAddListrers = mw => {
  const { updatePosition, updatePlaying } = playerSlice.actions;

  mw.startListening({
    actionCreator: chapterEnded,
    effect: (_, { getState, dispatch }) => {
      const { currentChapter, pauseOnChapterEnd } = getState().player.state;

      dispatch(updatePosition(0));
      dispatch(setPauseOnChapterEnd(false));

      if (currentChapter === getState().player.chapters.length - 1) {
        dispatch(updatePlaying(false));
        dispatch(loadChapter({ number: 0, position: 0 }));
        return;
      }

      dispatch(updatePlaying(!pauseOnChapterEnd));
      dispatch(loadChapter({ number: currentChapter + 1, position: 0 }));
    },
  });
};

export default addChapterEndAction;
