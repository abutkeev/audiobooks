import { createListenerMiddleware } from '@reduxjs/toolkit';
import { copyUrl } from '.';

export type BookState = { currentChapter: number; position: number };

type PlayerUtilsMiddlewareOptions = {
  copyBookStateUrl: (state: BookState) => void;
};

export const createPlayerUtilsMiddleware = ({ copyBookStateUrl }: PlayerUtilsMiddlewareOptions) => {
  const mw = createListenerMiddleware();

  mw.startListening({ actionCreator: copyUrl, effect: ({ payload }) => copyBookStateUrl(payload) });

  return mw.middleware;
};
