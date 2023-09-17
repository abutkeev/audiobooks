import { websocketSlice } from '.';
import { getSliceActionCreator } from '../..';

const createSliceAction = getSliceActionCreator(websocketSlice);
export const connect = createSliceAction('connect');
export const disconnect = createSliceAction('disconnect');
