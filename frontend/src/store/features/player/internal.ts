import { getSliceActionCreator } from '../..';
import { playerSlice } from './slice';

export const createSliceAction = getSliceActionCreator(playerSlice);

export const startUpdates = createSliceAction('startUpdates');
export const stopUpdates = createSliceAction('stopUpdates');
export const chapterEnded = createSliceAction('chapterEnded');
export const loadChapter = createSliceAction<{ number: number; position?: number }>('loadChapter');
