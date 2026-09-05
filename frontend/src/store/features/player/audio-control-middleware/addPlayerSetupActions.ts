import type { AudioControllAddListrers } from '.';
import { changeSpeed, changeVolume, closePlayer, pause } from '../actions';
import { playerReset, playerSetup, updateChapters } from '../slice';
import { loadChapter, stopUpdates } from '../internal';

const addPlayerSetupActions: AudioControllAddListrers = (mw, audio) => {
  mw.startListening({
    actionCreator: playerSetup,
    effect: (_, { getState, dispatch }) => {
      const {
        chapters,
        state: { currentChapter, position, volume, speed },
      } = getState().player;

      // a book without chapters loads nothing, and the previous one would keep sounding
      audio.pause();

      if (chapters.length === 0) return;

      dispatch(loadChapter({ number: currentChapter, position }));
      dispatch(changeVolume(volume));
      dispatch(changeSpeed(speed));
    },
  });

  mw.startListening({
    actionCreator: updateChapters,
    effect: (_, { getState, dispatch }) => {
      const { chapters, state } = getState().player;

      // the book lost the chapter being played: keeping its number would publish the position
      // under a chapter that no longer exists
      if (chapters.length === 0 || state.currentChapter < chapters.length) return;

      dispatch(loadChapter({ number: chapters.length - 1, position: 0 }));
    },
  });

  mw.startListening({
    actionCreator: closePlayer,
    effect: (_, { getState, dispatch }) => {
      const { bookId, state } = getState().player;

      if (!bookId) return;

      // the position has to be published while the book id is still there: every saver skips an empty one
      if (state.playing) dispatch(pause());

      dispatch(playerReset());
    },
  });

  mw.startListening({
    actionCreator: playerReset,
    effect: (_, { dispatch }) => {
      audio.pause();
      dispatch(stopUpdates());

      // an element holding a source keeps the lock screen entry alive; removeAttribute, not
      // src = '', which resolves to the page url and reports a media error
      audio.removeAttribute('src');
      audio.load();
    },
  });
};

export default addPlayerSetupActions;
