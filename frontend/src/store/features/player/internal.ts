import { getSliceActionCreator } from '@/store/getSliceActionCreator';
import { playerSlice } from './slice';

export const createSliceAction = getSliceActionCreator(playerSlice);

export const startUpdates = createSliceAction('startUpdates');
export const stopUpdates = createSliceAction('stopUpdates');
export const chapterEnded = createSliceAction('chapterEnded');
export const loadChapter = createSliceAction<{ number: number; position?: number }>('loadChapter');
export const retryChapter = createSliceAction('retryChapter');

/** The element says it plays and stays where it is: an iPhone answers a lock screen play so. */
export const playbackStalled = createSliceAction('playbackStalled');

export const setPreventLocalStorageSave = createSliceAction<boolean>('setPreventLocalStorageSave');
