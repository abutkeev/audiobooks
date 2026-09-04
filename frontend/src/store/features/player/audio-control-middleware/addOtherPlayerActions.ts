import type { AudioControllAddListrers } from '.';
import { ensureGainGraph, getGainNode } from './gainGraph';
import { changeSpeed, changeVolume, chapterChange, nextChapter, previousChapter, changePosition } from '../actions';
import { normalizeSpeed } from '../limits';
import { playerSlice } from '../slice';
import { loadChapter } from '../internal';

const addOtherPlayerActions: AudioControllAddListrers = (mw, audio) => {
  const { updateVolume, updateSpeed } = playerSlice.actions;
  mw.startListening({
    actionCreator: changeVolume,
    effect: ({ payload }, { dispatch }) => {
      // Route through Web Audio only when boost (>100%) is needed.
      // Otherwise keep the native path so iOS keeps playing in background.
      const gain = payload > 100 ? ensureGainGraph(audio) : getGainNode();
      if (gain) {
        audio.volume = 1;
        gain.gain.value = payload / 100;
      } else {
        audio.volume = payload / 100;
      }
      dispatch(updateVolume(payload));
    },
  });

  mw.startListening({
    actionCreator: changeSpeed,
    effect: ({ payload }, { dispatch }) => {
      const speed = normalizeSpeed(payload);
      // audio.load() on chapter change resets playbackRate to defaultPlaybackRate
      audio.defaultPlaybackRate = speed;
      audio.playbackRate = speed;
      dispatch(updateSpeed(speed));
    },
  });

  mw.startListening({
    actionCreator: chapterChange,
    effect: ({ payload }, { dispatch, getState }) => {
      if (!Number.isInteger(payload) || payload < 0 || payload >= getState().player.chapters.length) return;

      dispatch(loadChapter({ number: payload, position: 0 }));
    },
  });

  mw.startListening({
    actionCreator: nextChapter,
    effect: (_, { dispatch, getState }) => {
      const { chapters, state } = getState().player;

      if (state.currentChapter + 1 >= chapters.length) return;

      dispatch(loadChapter({ number: state.currentChapter + 1, position: 0 }));
    },
  });

  mw.startListening({
    actionCreator: previousChapter,
    effect: (_, { dispatch, getState }) => {
      const { currentChapter } = getState().player.state;

      if (currentChapter === 0) {
        dispatch(changePosition(0));
        return;
      }

      dispatch(loadChapter({ number: currentChapter - 1, position: 0 }));
    },
  });
};

export default addOtherPlayerActions;
