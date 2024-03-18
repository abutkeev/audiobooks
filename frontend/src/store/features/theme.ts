import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const localStorageThemeModeName = 'theme';

const initialState = {
  mode: localStorage.getItem(localStorageThemeModeName) || 'auto',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, { payload }: PayloadAction<string>) => {
      state.mode = payload;
      localStorage.setItem(localStorageThemeModeName, payload);
    },
  },
});

export const { setThemeMode } = themeSlice.actions;

export default themeSlice;
