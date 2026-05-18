import { AudioControllAddListrers, ensureGainGraph, getGainNode } from '.';
import { changePosition, changeSpeed, changeVolume, chapterChange, playerSlice } from '..';
import { loadChapter } from '../internal';

const addOtherPlayerActions: AudioControllAddListrers = (mw, audio) => {
  const { updatePosition, updateVolume, updateSpeed } = playerSlice.actions;
  mw.startListening({
    actionCreator: changeVolume,
    effect: ({ payload }, { dispatch }) => {
      // Route through Web Audio only when boost (>100%) is needed.
      // Otherwise keep the native path so iOS keeps playing in background.
      const gain = payload > 100 ? ensureGainGraph() : getGainNode();
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
      audio.playbackRate = payload;
      dispatch(updateSpeed(payload));
    },
  });

  mw.startListening({
    actionCreator: changePosition,
    effect: ({ payload }, { dispatch }) => {
      audio.currentTime = payload;
      dispatch(updatePosition(payload));
    },
  });

  mw.startListening({
    actionCreator: chapterChange,
    effect: ({ payload }, { dispatch, getState }) => {
      if (payload >= getState().player.chapters.length) return;

      dispatch(loadChapter({ number: payload, position: 0 }));
    },
  });
};

export default addOtherPlayerActions;
