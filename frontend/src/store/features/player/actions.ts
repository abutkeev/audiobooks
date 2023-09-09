import { BookState, Message } from './createPlayerUtilsMiddleware';
import { createSliceAction } from './internal';

export const changePosition = createSliceAction<number>('changePosition');
export const changeVolume = createSliceAction<number>('changeVolume');
export const pause = createSliceAction('pause');
export const play = createSliceAction('play');
export const forward = createSliceAction<number>('forward');
export const rewind = createSliceAction<number>('rewind');
export const chapterChange = createSliceAction<number>('chapterChange');
export const updateBookState = createSliceAction<{ bookId: string; currentChapter: number; position: number }>(
  'updateBookState'
);
export const copyUrl = createSliceAction<BookState>('copyUrl');
export const showMessage = createSliceAction<Message>('showMessage');
