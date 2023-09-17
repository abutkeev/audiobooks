import { createListenerMiddleware } from '@reduxjs/toolkit';
import authSlice, { setAuthToken } from '../auth';
import { Socket, io } from 'socket.io-client';

const connectSocket = (token: string | null) => {
  if (!token) return;

  const socket = io('/api/events', {
    transports: ['websocket'],
    auth: {
      token,
    },
  });
  return socket;
};

let socket: Socket | undefined = connectSocket(authSlice.getInitialState().token);

type StateSlice = { [authSlice.name]: ReturnType<typeof authSlice.getInitialState> };

const mw = createListenerMiddleware<StateSlice>();

mw.startListening({
  actionCreator: setAuthToken,
  effect: ({ payload }) => {
    if (socket) {
      socket.close();
      socket = undefined;
    }
    socket = connectSocket(payload);
  },
});

export const websocketMiddleware = mw.middleware;
