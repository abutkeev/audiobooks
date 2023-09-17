import authSlice from '../auth';
import websocketSlice from './slice';

export type StateSlice = {
  [authSlice.name]: ReturnType<typeof authSlice.getInitialState>;
  [websocketSlice.name]: ReturnType<typeof websocketSlice.getInitialState>;
};

export { websocketMiddleware } from './websocketMiddleware';

export { websocketSlice };

export * from './actions';
