import { ListenerMiddlewareInstance, createListenerMiddleware } from '@reduxjs/toolkit';
import { PlayerStateSlice } from '..';
import addAudioEventListeners from './addAudioEventListeners';
import addPlayerSetupActions from './addPlayerSetupActions';
import addOtherPlayerActions from './addOtherPlayerActions';
import addPlayerUpdates from './addPlayerUpdates';
import addLoadChapterAction from './addLoadChapterAction';
import addPlayPauseActions from './addPlayPauseActions';
import addRewindAction from './addRewindAction';
import addForwardAction from './addForwardAction';
import addChapterEndAction from './addChapterEndAction';
import addUpdateBookStateAction from './addUpdateBookStateAction';

export type AudioControllAddListrers = (
  mw: ListenerMiddlewareInstance<PlayerStateSlice>,
  audio: HTMLAudioElement
) => void;

const mw = createListenerMiddleware<PlayerStateSlice>();
const audio = new Audio();

let audioCtx: AudioContext | null = null;
let gainNode: GainNode | null = null;

export const getAudioCtx = () => audioCtx;
export const getGainNode = () => gainNode;

export const ensureGainGraph = (): GainNode => {
  if (gainNode) return gainNode;
  audioCtx = new AudioContext();
  const source = audioCtx.createMediaElementSource(audio);
  gainNode = audioCtx.createGain();
  source.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  return gainNode;
};

addAudioEventListeners(mw, audio);
addPlayerUpdates(mw, audio);
addPlayerSetupActions(mw, audio);
addLoadChapterAction(mw, audio);
addChapterEndAction(mw, audio);
addPlayPauseActions(mw, audio);
addForwardAction(mw, audio);
addRewindAction(mw, audio);
addOtherPlayerActions(mw, audio);
addUpdateBookStateAction(mw, audio);

export const audioControlMiddleware = mw.middleware;
