import { ListenerMiddlewareInstance, createListenerMiddleware } from '@reduxjs/toolkit';
import type { PlayerStateSlice } from '..';
import addAudioEventListeners from './addAudioEventListeners';
import addPlayerSetupActions from './addPlayerSetupActions';
import addOtherPlayerActions from './addOtherPlayerActions';
import addPositionAction from './addPositionAction';
import addPlayerUpdates from './addPlayerUpdates';
import addLoadChapterAction from './addLoadChapterAction';
import addPlayPauseActions from './addPlayPauseActions';
import addRewindAction from './addRewindAction';
import addForwardAction from './addForwardAction';
import addChapterEndAction from './addChapterEndAction';
import addUpdateBookStateAction from './addUpdateBookStateAction';
import addDiagnostics from './addDiagnostics';
import addSleepTimer from './addSleepTimer';

export type AudioControllAddListrers = (
  mw: ListenerMiddlewareInstance<PlayerStateSlice>,
  audio: HTMLAudioElement
) => void;

const mw = createListenerMiddleware<PlayerStateSlice>();
const audio = new Audio();

addDiagnostics(mw, audio);
addAudioEventListeners(mw, audio);
addPlayerUpdates(mw, audio);
addPlayerSetupActions(mw, audio);
addLoadChapterAction(mw, audio);
addChapterEndAction(mw, audio);
addPlayPauseActions(mw, audio);
addForwardAction(mw, audio);
addRewindAction(mw, audio);
addPositionAction(mw, audio);
addOtherPlayerActions(mw, audio);
addUpdateBookStateAction(mw, audio);
addSleepTimer(mw, audio);

export const audioControlMiddleware = mw.middleware;
