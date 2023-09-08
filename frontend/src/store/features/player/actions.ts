import { createSliceAction } from './internal';

export const changePosition = createSliceAction<number>('changePosition');
export const changeVolume = createSliceAction<number>('changeVolume');
export const pause = createSliceAction('pause');
export const play = createSliceAction('play');
export const forward = createSliceAction<number>('forward');
export const rewind = createSliceAction<number>('rewind');
export const chapterChange = createSliceAction<number>('chapterChange');
