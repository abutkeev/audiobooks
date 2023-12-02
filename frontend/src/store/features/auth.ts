import { PayloadAction, createListenerMiddleware, createSlice, isRejectedWithValue } from '@reduxjs/toolkit';
import { api } from '@/api/api';
import { parseToken } from '@/hooks/useAuthData';

const localStorageTokenName = 'authToken';

type AuthStateSlice = {
  [authSlice.name]: ReturnType<typeof authSlice.getInitialState>;
};

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

const mw = createListenerMiddleware<AuthStateSlice>();
mw.startListening({
  actionCreator: setAuthToken,
  effect: ({ payload }, { dispatch, getState }) => {
    const oldAuth = parseToken(getState().auth.token);
    const newAuth = parseToken(payload);

    if (!oldAuth || !newAuth || oldAuth.admin !== newAuth.admin || oldAuth.enabled !== newAuth.enabled) {
      dispatch(api.util.resetApiState());
    }
  },
});

mw.startListening({
  predicate: action =>
    isRejectedWithValue(action) &&
    typeof action.payload === 'object' &&
    !!action.payload &&
    'status' in action.payload &&
    action.payload.status === 403,
  effect: (_, { dispatch }) => void dispatch(setAuthToken('')),
});

export const authMiddleware = mw.middleware;

export default authSlice;
