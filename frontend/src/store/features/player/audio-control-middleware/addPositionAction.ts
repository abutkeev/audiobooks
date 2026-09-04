import type { AudioControllAddListrers } from '.';
import { changePosition } from '../actions';
import { playerSlice } from '../slice';

const addPositionAction: AudioControllAddListrers = (mw, audio) => {
  const { updatePosition } = playerSlice.actions;

  mw.startListening({
    actionCreator: changePosition,
    effect: ({ payload }, { dispatch }) => {
      audio.currentTime = payload;
      dispatch(updatePosition(payload));
    },
  });
};

export default addPositionAction;
