import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const localStorageTokenName = 'authToken';

const initialState = {
  token: localStorage.getItem(localStorageTokenName),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthToken: (state, { payload }: PayloadAction<string>) => {
      state.token = payload;
      localStorage.setItem(localStorageTokenName, payload);
    },
  },
});

export const { setAuthToken } = authSlice.actions;

export default authSlice;
