import { PayloadAction, createListenerMiddleware, createSlice, isRejectedWithValue } from '@reduxjs/toolkit';
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

mw.startListening({
  predicate: action =>
    isRejectedWithValue(action) &&
    typeof action.payload === 'object' &&
    !!action.payload &&
    'status' in action.payload &&
    action.payload.status === 401,
  effect: (_, { dispatch }) => void dispatch(setAuthToken('')),
});

export const authMiddleware = mw.middleware;

export default authSlice;
