import websocketSlice from './slice';
import { getSliceActionCreator } from '@/store/getSliceActionCreator';

const createSliceAction = getSliceActionCreator(websocketSlice);
export const connect = createSliceAction('connect');
export const disconnect = createSliceAction('disconnect');
