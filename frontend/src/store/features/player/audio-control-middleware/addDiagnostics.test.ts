import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import addDiagnostics from './addDiagnostics';
import { DiagnosticsEntry } from './diagnosticsLog';
import { playerReset, playerSetup, playerSlice, setDiagnostics } from '../slice';
import { changePosition } from '../actions';
import type { PlayerStateSlice } from '..';

const chapters = [{ title: 'one', filename: 'one.mp3' }];

const handlers = new Map<string, () => void>();

const fakeAudio = {
  readyState: 4,
  networkState: 1,
  currentTime: 0,
  duration: 300,
  paused: false,
  currentSrc: 'https://example.test/one.mp3',
  error: null,
  addEventListener: (name: string, handler: () => void) => void handlers.set(name, handler),
} as unknown as HTMLAudioElement;

const emit = (name: string) => handlers.get(name)?.();

describe('addDiagnostics', () => {
  let sent: DiagnosticsEntry[];
  let store: ReturnType<typeof createStore>;

  const items = new Map<string, string>();
  const storage = {
    getItem: (key: string) => items.get(key) ?? null,
    setItem: (key: string, value: string) => void items.set(key, value),
    removeItem: (key: string) => void items.delete(key),
  };

  const createStore = () => {
    const mw = createListenerMiddleware<PlayerStateSlice>();
    addDiagnostics(mw, fakeAudio, {
      send: entries => {
        sent.push(...entries);
        return true;
      },
      storage,
    });

    return configureStore({
      reducer: { [playerSlice.name]: playerSlice.reducer },
      middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(mw.middleware),
    });
  };

  // the batch leaves on the interval the playerSetup effect starts
  const flushed = (kind: DiagnosticsEntry['kind'] = 'action') => {
    vi.advanceTimersByTime(30000);
    return sent.filter(entry => entry.kind === kind);
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('document', { visibilityState: 'visible', addEventListener: () => undefined });
    vi.stubGlobal('window', { addEventListener: () => undefined });

    sent = [];
    items.clear();
    handlers.clear();
    store = createStore();
    store.dispatch(playerSetup({ bookId: 'book', chapters }));
    store.dispatch(setDiagnostics(true));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('records the action that turns the mode off', () => {
    store.dispatch(setDiagnostics(false));

    expect(flushed().map(({ name }) => name)).toContain(setDiagnostics.type);
  });

  it('records a reset that clears the flag itself', () => {
    store.dispatch(playerReset());

    expect(flushed().map(({ name }) => name)).toContain(playerReset.type);
  });

  it('records nothing while the mode is off', () => {
    store.dispatch(setDiagnostics(false));
    vi.advanceTimersByTime(30000);
    sent = [];

    store.dispatch(changePosition(10));

    expect(flushed()).toHaveLength(0);
  });

  it('keeps one entry for a drag over the slider', () => {
    store.dispatch(changePosition(10));
    store.dispatch(changePosition(20));
    store.dispatch(changePosition(30));

    const positions = flushed().filter(({ name }) => name === changePosition.type);

    expect(positions).toHaveLength(1);
    expect(positions[0]).toMatchObject({ payload: 30 });
  });

  it('keeps both positions when the drag paused', () => {
    store.dispatch(changePosition(10));
    vi.advanceTimersByTime(1000);
    store.dispatch(changePosition(20));

    expect(flushed().filter(({ name }) => name === changePosition.type)).toHaveLength(2);
  });
  it('keeps one heartbeat per interval while the chapter plays', () => {
    emit('timeupdate');
    emit('timeupdate');

    expect(flushed('event').filter(({ name }) => name === 'timeupdate')).toHaveLength(1);
  });

  it('beats again once the interval has passed', () => {
    emit('timeupdate');
    // moves the clock without running the tick, which would take the beat for itself
    vi.setSystemTime(Date.now() + 30000);
    emit('timeupdate');

    expect(flushed('event').filter(({ name }) => name === 'timeupdate')).toHaveLength(2);
  });

  it('lets a new chapter confirm it moves without waiting the beat out', () => {
    emit('timeupdate');
    emit('loadstart');
    emit('timeupdate');

    expect(flushed('event').filter(({ name }) => name === 'timeupdate')).toHaveLength(2);
  });

  it('fills the silence with a tick', () => {
    vi.advanceTimersByTime(30000);

    expect(flushed('event').filter(({ name }) => name === 'tick')).not.toHaveLength(0);
  });
});
