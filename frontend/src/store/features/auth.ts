import { PayloadAction, createListenerMiddleware, createSlice } from '@reduxjs/toolkit';
import { api } from '../../api/api';

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

const mw = createListenerMiddleware();
mw.startListening({
  actionCreator: setAuthToken,
  effect: (_, { dispatch }) => {
    dispatch(api.util.resetApiState());
  },
});

export const authMiddleware = mw.middleware;

export default authSlice;
