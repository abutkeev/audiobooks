import { configureStore, createListenerMiddleware, ListenerMiddlewareInstance, Middleware } from '@reduxjs/toolkit';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import addSleepTimer from './addSleepTimer';
import { playerReset, playerSlice } from '../slice';
import { pause } from '../actions';
import type { PlayerStateSlice } from '..';

const minute = 60 * 1000;

describe('sleep timer listener', () => {
  let store: ReturnType<typeof createStore>;
  let dispatched: string[] = [];
  let activityListeners: Record<string, () => void>;

  const recorder: Middleware = () => next => action => {
    dispatched.push((action as { type: string }).type);
    return next(action);
  };

  const createStore = (mw: ListenerMiddlewareInstance<PlayerStateSlice>) =>
    configureStore({
      reducer: { [playerSlice.name]: playerSlice.reducer },
      middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(mw.middleware).concat(recorder),
    });

  beforeEach(() => {
    vi.useFakeTimers();
    activityListeners = {};
    vi.stubGlobal('window', {
      addEventListener: (type: string, listener: () => void) => (activityListeners[type] = listener),
      removeEventListener: (type: string) => delete activityListeners[type],
    });

    const mw = createListenerMiddleware<PlayerStateSlice>();
    addSleepTimer(mw, {} as HTMLAudioElement);
    store = createStore(mw);
    store.dispatch(playerSlice.actions.playerSetup({ bookId: 'book', chapters: [] }));
    dispatched = [];
  });

  afterEach(() => {
    store.dispatch(playerSlice.actions.clearSleepTimer());
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('pauses when the time is up', () => {
    store.dispatch(playerSlice.actions.updatePlaying(true));
    store.dispatch(playerSlice.actions.setSleepTimer(15));

    vi.advanceTimersByTime(15 * minute);

    expect(dispatched).toContain(pause.type);
    expect(store.getState().player.sleepTimer).toBeUndefined();
  });

  it('spares the position of a player already stopped', () => {
    store.dispatch(playerSlice.actions.setSleepTimer(15));

    vi.advanceTimersByTime(15 * minute);

    // a pause moves the position five seconds back, and a stopped book has nothing to pause
    expect(dispatched).not.toContain(pause.type);
    expect(store.getState().player.sleepTimer).toBeUndefined();
  });

  it('holds the pause until the end', () => {
    store.dispatch(playerSlice.actions.updatePlaying(true));
    store.dispatch(playerSlice.actions.setSleepTimer(15));

    vi.advanceTimersByTime(14 * minute);

    expect(dispatched).not.toContain(pause.type);
  });

  it('puts the end off on activity', () => {
    store.dispatch(playerSlice.actions.updatePlaying(true));
    store.dispatch(playerSlice.actions.setSleepTimer(15));

    vi.advanceTimersByTime(14 * minute);
    activityListeners.mousemove();
    vi.advanceTimersByTime(2 * minute);

    expect(dispatched).not.toContain(pause.type);
  });

  it('leaves the end alone when the setting is off', () => {
    store.dispatch(playerSlice.actions.updatePlaying(true));
    store.dispatch(playerSlice.actions.setResetSleepTimerOnActivity(false));
    store.dispatch(playerSlice.actions.setSleepTimer(15));

    vi.advanceTimersByTime(14 * minute);
    activityListeners.mousemove();
    vi.advanceTimersByTime(2 * minute);

    expect(dispatched).toContain(pause.type);
  });

  it('survives a book change and dies with the player', () => {
    store.dispatch(playerSlice.actions.updatePlaying(true));
    store.dispatch(playerSlice.actions.setSleepTimer(15));
    store.dispatch(playerSlice.actions.playerSetup({ bookId: 'next', chapters: [] }));

    expect(store.getState().player.sleepTimer).toBeDefined();

    store.dispatch(playerReset());

    expect(store.getState().player.sleepTimer).toBeUndefined();
    // the interval and the activity listeners have to go with it, not linger for the session
    expect(activityListeners).toEqual({});

    vi.advanceTimersByTime(20 * minute);

    expect(dispatched).not.toContain(pause.type);
  });
});
