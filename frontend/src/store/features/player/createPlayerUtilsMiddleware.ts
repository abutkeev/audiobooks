import { createListenerMiddleware } from '@reduxjs/toolkit';
import { copyUrl, showMessage } from '.';
import { AlertProps } from '@mui/material';

export type BookState = { currentChapter: number; position: number };

export type Message = {
  text: string;
  timeout?: number;
  severity?: AlertProps['severity'];
};

type PlayerUtilsMiddlewareOptions = {
  copyBookStateUrl?: (state: BookState) => void;
  showMessage?: (message: Message) => void;
};

export const createPlayerUtilsMiddleware = ({
  copyBookStateUrl,
  showMessage: showMessageFunction,
}: PlayerUtilsMiddlewareOptions) => {
  const mw = createListenerMiddleware();

  if (copyBookStateUrl) {
    mw.startListening({ actionCreator: copyUrl, effect: ({ payload }) => copyBookStateUrl(payload) });
  }

  if (showMessageFunction) {
    mw.startListening({ actionCreator: showMessage, effect: ({ payload }) => showMessageFunction(payload) });
  }

  return mw.middleware;
};
