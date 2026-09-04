import type { ListenerMiddlewareInstance } from '@reduxjs/toolkit';
import type { PlayerStateSlice } from '..';
import {
  changePosition,
  chapterChange,
  forward,
  nextChapter,
  pause,
  play,
  previousChapter,
  rewind,
  showMessage,
  updateBookState,
} from '../actions';
import { playerReset, playerSetup, playerSlice, setDiagnostics } from '../slice';
import { chapterEnded, loadChapter, retryChapter } from '../internal';
import createDiagnosticsLog, { DiagnosticsEntry, DiagnosticsLogOptions } from './diagnosticsLog';
import sendDiagnostics from './diagnosticsTransport';

const flushInterval = 30000;
const beatInterval = 30000;
const tickInterval = 5000;
const coalesceInterval = 500;

const mediaEvents = [
  'loadstart',
  'loadedmetadata',
  'play',
  'canplay',
  'playing',
  'pause',
  'waiting',
  'stalled',
  'suspend',
  'ended',
  'error',
  'abort',
  'timeupdate',
];

const recorded = new Set(
  [
    loadChapter,
    retryChapter,
    chapterEnded,
    play,
    pause,
    changePosition,
    forward,
    rewind,
    chapterChange,
    nextChapter,
    previousChapter,
    updateBookState,
    showMessage,
    playerReset,
    setDiagnostics,
    playerSlice.actions.setError,
    playerSetup,
  ].map(({ type }) => type)
);

const round = (value: number) => (isFinite(value) ? Math.round(value) : null);

// the raw payload carries the whole chapter list; the log needs the book and the session border
const summary = (payload: unknown) => {
  const { bookId, chapters } = (payload ?? {}) as { bookId?: string; chapters?: unknown[] };

  return { bookId, chapters: chapters?.length };
};

const addDiagnostics = (
  mw: ListenerMiddlewareInstance<PlayerStateSlice>,
  audio: HTMLAudioElement,
  deps?: DiagnosticsLogOptions
) => {
  const log = createDiagnosticsLog(deps ?? { send: sendDiagnostics, storage: localStorage });

  const entry = (kind: DiagnosticsEntry['kind'], name: string) => ({ at: new Date().toISOString(), kind, name });

  mw.startListening({
    actionCreator: playerSetup,
    effect: (_, { getState, unsubscribe }) => {
      const enabled = () => getState().player.state.diagnostics;

      const elementState = () => ({
        readyState: audio.readyState,
        networkState: audio.networkState,
        currentTime: round(audio.currentTime),
        duration: round(audio.duration),
        paused: audio.paused,
        src: audio.currentSrc.split('/').pop() || null,
        error: audio.error ? `${audio.error.code}: ${audio.error.message}` : null,
      });

      // only timeupdate and tick move the beat: the reset on loadstart must survive until the
      // chapter actually plays
      let lastBeat = 0;

      mediaEvents.forEach(name =>
        audio.addEventListener(name, () => {
          if (!enabled()) return;

          if (name === 'timeupdate') {
            if (Date.now() - lastBeat < beatInterval) return;
            lastBeat = Date.now();
          }

          // a new chapter must confirm it moves without waiting the beat out
          if (name === 'loadstart') lastBeat = 0;

          log.record({ ...entry('event', name), ...elementState() });
        })
      );

      document.addEventListener('visibilitychange', () => {
        if (enabled()) {
          log.record({ ...entry('event', 'visibilitychange'), visibility: document.visibilityState });
        }

        // hiding is the last moment before iOS may freeze the page
        log.flush();
      });

      window.addEventListener('pagehide', () => {
        if (enabled()) log.record(entry('event', 'pagehide'));

        log.flush();
      });

      // checked far more often than the beat: a beat missed by a moment would otherwise wait
      // out a whole interval, and the log would show a gap twice the promised length
      let lastFlush = Date.now();
      setInterval(() => {
        if (enabled() && Date.now() - lastBeat >= beatInterval) {
          lastBeat = Date.now();
          log.record({ ...entry('event', 'tick'), ...elementState() });
        }

        if (Date.now() - lastFlush < flushInterval) return;

        lastFlush = Date.now();
        log.flush();
      }, tickInterval);

      // what the previous session could not send: the tab may have been killed while locked
      log.flush();

      unsubscribe();
    },
  });

  mw.startListening({
    predicate: ({ type }) => recorded.has(type),
    effect: ({ type, payload }: { type: string; payload?: unknown }, { getState, getOriginalState }) => {
      // playerReset and setDiagnostics change the flag themselves, so either side of the change counts
      if (!getOriginalState().player.state.diagnostics && !getState().player.state.diagnostics) return;

      const record = { ...entry('action', type), payload: type === playerSetup.type ? summary(payload) : payload };
      const { last } = log;

      // the slider dispatches on every step of a drag
      const repeats =
        type === changePosition.type &&
        last?.kind === 'action' &&
        last.name === type &&
        Date.now() - Date.parse(last.at) < coalesceInterval;

      if (repeats) {
        log.replaceLast(record);
        return;
      }

      log.record(record);
    },
  });
};

export default addDiagnostics;
