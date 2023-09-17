import { createListenerMiddleware } from '@reduxjs/toolkit';
import { Socket, io } from 'socket.io-client';
import { StateSlice } from '.';
import { setConnected } from './slice';
import { connect, disconnect } from './actions';

let socket: Socket | undefined;

const mw = createListenerMiddleware<StateSlice>();

mw.startListening({
  actionCreator: connect,
  effect: (_, { getState, dispatch }) => {
    if (socket) return;

    const {
      auth: { token },
    } = getState();

    if (!token) return;

    socket = io('/api/events', {
      transports: ['websocket'],
      auth: {
        token,
      },
    });
    socket.on('connect', () => dispatch(setConnected(true)));
    socket.on('disconnect', () => dispatch(setConnected(false)));
  },
});

mw.startListening({
  actionCreator: disconnect,
  effect: () => {
    if (socket && socket.connected) {
      socket.close();
      socket = undefined;
    }
  },
});

export const websocketMiddleware = mw.middleware;
