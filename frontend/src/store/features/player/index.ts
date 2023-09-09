import { playerSlice } from '.';

export * from './slice';
export * from './actions';
export { audioControlMiddleware } from './audio-control-middleware';
export { createLocalStorageMiddleware } from './local-storage-middleware';
export { createPlayerUtilsMiddleware } from './createPlayerUtilsMiddleware';
export type { BookState } from './createPlayerUtilsMiddleware';

export type PlayerStateSlice = { [playerSlice.name]: ReturnType<typeof playerSlice.getInitialState> };
