import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = '';

const titleSlice = createSlice({
  name: 'title',
  initialState,
  reducers: {
    setTitle: (_, { payload }: PayloadAction<string>) => {
      return payload;
    },
  },
});

export const { setTitle } = titleSlice.actions;

export default titleSlice;
