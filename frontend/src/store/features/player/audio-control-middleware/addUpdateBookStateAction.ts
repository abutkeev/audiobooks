import { AudioControllAddListrers } from '.';
import { playerSlice, updateBookState } from '..';
import { loadChapter, stopUpdates } from '../internal';

const addUpdateBookStateAction: AudioControllAddListrers = (mw) => {
  const { updatePlaying } = playerSlice.actions;

  mw.startListening({
    actionCreator: updateBookState,
    effect: ({ payload: { bookId, currentChapter, position } }, { dispatch, getState }) => {
      if (bookId !== getState().player.bookId) return;

      dispatch(stopUpdates());
      dispatch(updatePlaying(false));
      dispatch(loadChapter({ number: currentChapter, position: position }));
    },
  });
};

export default addUpdateBookStateAction;
