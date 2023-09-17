import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
  connected: false,
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
