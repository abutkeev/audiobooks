import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import getInstanceId from './getInstanceId';

const initialState = {
  connected: false,
  instanceId: getInstanceId(),
};

const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    setConnected: (state, { payload }: PayloadAction<boolean>) => {
      state.connected = payload;
    },
  },
});

export const { setConnected } = websocketSlice.actions;

export default websocketSlice;
