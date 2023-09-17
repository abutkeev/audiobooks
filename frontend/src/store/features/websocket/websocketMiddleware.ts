import { createListenerMiddleware } from '@reduxjs/toolkit';
import { Socket, io } from 'socket.io-client';
import { StateSlice } from '.';
import { setConnected } from './slice';
import { connect, disconnect } from './actions';
import { playerSetup } from '../player';
import getInstanceId from './getInstanceId';

let socket: Socket | undefined;

const mw = createListenerMiddleware<StateSlice>();

const instanceId = getInstanceId();

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

mw.startListening({
  predicate: (action, currentState, originalState) => {
    if (
      !socket ||
      !socket.connected ||
      (currentState.player.state === originalState.player.state &&
        originalState.websocket.connected === currentState.websocket.connected) ||
      currentState.player.bookId === '' ||
      playerSetup.match(action)
    ) {
      return false;
    }

    return true;
  },
  effect: (_, { getState }) => {
    const {
      bookId,
      state: { currentChapter, position },
    } = getState().player;
    const updated = new Date().toISOString();
    socket?.emit('position_update', { instanceId, bookId, currentChapter, position, updated });
  },
});

export const websocketMiddleware = mw.middleware;
