export const maxVolume = 300;

export const minSpeed = 0.25;
export const maxSpeed = 3;
export const speedStep = 0.05;

export const normalizeSpeed = (speed: number) =>
  isFinite(speed) ? Math.round(Math.min(Math.max(speed, minSpeed), maxSpeed) * 100) / 100 : 1;
