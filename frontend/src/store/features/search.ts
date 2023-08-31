import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
  show: false,
  text: '',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    showSearch: (state, { payload }: PayloadAction<boolean>) => {
      state.show = payload;
    },
    setSearchText: (state, { payload }: PayloadAction<string>) => {
      state.text = payload;
    },
  },
});

export const { showSearch, setSearchText } = searchSlice.actions;

export default searchSlice;
