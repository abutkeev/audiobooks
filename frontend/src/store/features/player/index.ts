import { playerSlice } from '.';

export * from './slice';
export * from './actions';
export { audioControlMiddleware } from './audio-control-middleware';
export { createLocalStorageMiddleware } from './local-storage-middleware';
export { createPlayerUtilsMiddleware } from './createPlayerUtilsMiddleware';
export type { BookState } from './createPlayerUtilsMiddleware';

export type PlayerStateSlice = { [playerSlice.name]: ReturnType<typeof playerSlice.getInitialState> };

export const maxVolume = 300;

export const minSpeed = 0.25;
export const maxSpeed = 3;
export const speedStep = 0.05;

export const normalizeSpeed = (speed: number) =>
  isFinite(speed) ? Math.round(Math.min(Math.max(speed, minSpeed), maxSpeed) * 100) / 100 : 1;
