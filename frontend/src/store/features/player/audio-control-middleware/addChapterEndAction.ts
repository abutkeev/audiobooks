import type { AudioControllAddListrers } from '.';
import { playerSlice, setPauseOnChapterEnd } from '../slice';
import { chapterEnded, loadChapter, stopUpdates } from '../internal';

const addChapterEndAction: AudioControllAddListrers = mw => {
  const { updatePlaying } = playerSlice.actions;

  mw.startListening({
    actionCreator: chapterEnded,
    effect: (_, { getState, dispatch }) => {
      const { bookId, state } = getState().player;
      if (!bookId) return;

      const { currentChapter, pauseOnChapterEnd } = state;

      dispatch(setPauseOnChapterEnd(false));

      if (currentChapter === getState().player.chapters.length - 1) {
        dispatch(updatePlaying(false));
        dispatch(stopUpdates());

        if (getState().player.bookInfo.draft) return;

        dispatch(loadChapter({ number: 0, position: 0 }));
        return;
      }

      // the position is left to loadChapter: here the store still holds the duration of the
      // chapter that just ended, and a zero would be published as its beginning
      dispatch(updatePlaying(!pauseOnChapterEnd));
      dispatch(loadChapter({ number: currentChapter + 1, position: 0 }));
    },
  });
};

export default addChapterEndAction;
