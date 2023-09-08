import { AudioControllAddListrers } from '.';
import { changePosition, changeVolume, chapterChange, playerSlice } from '..';
import { loadChapter } from '../internal';

const addOtherPlayerActions: AudioControllAddListrers = (mw, audio) => {
  const { updatePosition, updateVolume } = playerSlice.actions;
  mw.startListening({
    actionCreator: changeVolume,
    effect: ({ payload }, { dispatch }) => {
      audio.volume = payload / 100;
      dispatch(updateVolume(payload));
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
