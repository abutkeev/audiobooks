import authSlice from '../auth';
import { playerSlice } from '../player';
import websocketSlice from './slice';

export type StateSlice = {
  [authSlice.name]: ReturnType<typeof authSlice.getInitialState>;
  [websocketSlice.name]: ReturnType<typeof websocketSlice.getInitialState>;
  [playerSlice.name]: ReturnType<typeof playerSlice.getInitialState>;
};

export { websocketMiddleware } from './websocketMiddleware';

export { websocketSlice };

export * from './actions';
