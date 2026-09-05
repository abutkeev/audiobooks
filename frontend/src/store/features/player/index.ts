import type { playerSlice } from './slice';

export * from './slice';
export * from './limits';
export * from './actions';
export { audioControlMiddleware } from './audio-control-middleware';
export { createLocalStorageMiddleware, readSavedBookState } from './local-storage-middleware';
export { createPlayerUtilsMiddleware } from './createPlayerUtilsMiddleware';
export type { BookState } from './createPlayerUtilsMiddleware';

export type PlayerStateSlice = { [playerSlice.name]: ReturnType<typeof playerSlice.getInitialState> };
