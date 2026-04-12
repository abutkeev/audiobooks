import { createListenerMiddleware } from '@reduxjs/toolkit';
import { Socket, io } from 'socket.io-client';
import { StateSlice } from '.';
import { setConnected } from './slice';
import { connect, disconnect } from './actions';
import { playerSetup } from '../player';
import enhancedApi from '@/api/enhancedApi';
import { setAuthToken } from '../auth';
import { throttle } from 'throttle-debounce';

let socket: Socket | undefined;

const mw = createListenerMiddleware<StateSlice>();

const updateOnline = throttle(60000, () => socket?.emit('online'), { noLeading: false, noTrailing: false });

window.addEventListener('mousemove', updateOnline);
window.addEventListener('touchstart', updateOnline);

mw.startListening({
  actionCreator: connect,
  effect: (_, { getState, dispatch }) => {
    const {
      auth: { token },
      websocket: { instanceId },
    } = getState();

    if (!token) return;

    if (socket?.connected) return;

    if (socket) {
      socket.auth = { token, instanceId };
      socket.connect();
      return;
    }

    socket = io('/api/events', {
      transports: ['websocket'],
      auth: {
        token,
        instanceId,
      },
    });
    socket.on('connect', () => dispatch(setConnected(true)));
    socket.on('disconnect', () => dispatch(setConnected(false)));
    socket.on('invalidate_tag', tag => dispatch(enhancedApi.util.invalidateTags([tag])));
    socket.on('refresh_token', async () => {
      const response = await dispatch(enhancedApi.endpoints.authGenerateToken.initiate());
      if ('data' in response) {
        const { access_token } = response.data;
        dispatch(setAuthToken(access_token));
        if (socket) {
          socket.auth = { token: access_token, instanceId: getState().websocket.instanceId };
        }
      }
    });
  },
});

mw.startListening({
  actionCreator: disconnect,
  effect: () => {
    if (socket) {
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
      !currentState.player.state.duration ||
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
    socket?.emit('position_update', { bookId, currentChapter, position, updated });
    updateOnline();
  },
});

export const websocketMiddleware = mw.middleware;
