import type { AudioControllAddListrers } from '.';
import { t } from 'i18next';
import { showMessage, updateBookState } from '../actions';
import { playerSlice } from '../slice';
import { loadChapter } from '../internal';

const addUpdateBookStateAction: AudioControllAddListrers = mw => {
  const { updatePlaying } = playerSlice.actions;

  mw.startListening({
    actionCreator: updateBookState,
    effect: ({ payload: { bookId, currentChapter, position } }, { dispatch, getState }) => {
      const { bookId: currentBookId, chapters } = getState().player;

      if (bookId !== currentBookId) return;

      // the state may come from an url, a bookmark or another device and outlive the book it was
      // made for; a negative position is loadChapter's own convention and must not come from outside
      if (
        !Number.isInteger(currentChapter) ||
        currentChapter < 0 ||
        currentChapter >= chapters.length ||
        !(position >= 0)
      ) {
        dispatch(showMessage({ severity: 'error', text: t("Can't apply the saved position") }));
        return;
      }

      dispatch(updatePlaying(false));
      dispatch(loadChapter({ number: currentChapter, position: position }));
    },
  });
};

export default addUpdateBookStateAction;
