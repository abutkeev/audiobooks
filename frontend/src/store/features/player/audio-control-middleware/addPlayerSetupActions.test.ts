import { configureStore, createListenerMiddleware, ListenerMiddlewareInstance, Middleware } from '@reduxjs/toolkit';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import addPlayerSetupActions from './addPlayerSetupActions';
import addPlayPauseActions from './addPlayPauseActions';
import { playerReset, playerSlice, updateChapters } from '../slice';
import { closePlayer, pause, play } from '../actions';
import { loadChapter } from '../internal';
import type { PlayerStateSlice } from '..';

const chapters = [
  { title: 'one', filename: 'one.mp3', duration: 600 },
  { title: 'two', filename: 'two.mp3', duration: 300 },
];

class FakeAudio {
  src = '';
  paused = true;
  loads = 0;
  currentTime = 0;
  play = vi.fn(() => {
    this.paused = false;
    return Promise.resolve();
  });
  pause = vi.fn(() => {
    this.paused = true;
  });
  removeAttribute = vi.fn((name: string) => {
    if (name === 'src') this.src = '';
  });
  load = vi.fn(() => {
    this.loads += 1;
  });
}

describe('player session listeners', () => {
  let audio: FakeAudio;
  let store: ReturnType<typeof createStore>;
  let dispatched: string[] = [];

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
    audio = new FakeAudio();
    const mw = createListenerMiddleware<PlayerStateSlice>();
    addPlayerSetupActions(mw, audio as unknown as HTMLAudioElement);
    addPlayPauseActions(mw, audio as unknown as HTMLAudioElement);
    store = createStore(mw);
    dispatched = [];
  });

  const openBook = () => {
    store.dispatch(playerSlice.actions.playerSetup({ bookId: 'book', chapters }));
    store.dispatch(playerSlice.actions.updateDuration(600));
    store.dispatch(playerSlice.actions.updatePosition(120));
    store.dispatch(playerSlice.actions.updatePlaying(true));
    audio.paused = false;
    audio.pause.mockClear();
    dispatched = [];
  };

  it('publishes the position before the book id is gone', () => {
    openBook();

    store.dispatch(closePlayer());

    // every saver skips an empty book id, so the position has to be updated ahead of the reset
    expect(dispatched).toContain(pause.type);
    expect(dispatched.indexOf(pause.type)).toBeLessThan(dispatched.indexOf(playerReset.type));
    expect(store.getState().player.bookId).toBe('');
  });

  it('lets go of the source of a book on pause', () => {
    openBook();
    store.dispatch(playerSlice.actions.updatePlaying(false));
    audio.paused = true;
    audio.pause.mockClear();
    dispatched = [];

    store.dispatch(closePlayer());

    // nothing else stops the element here: a book on pause gets no pause action
    expect(dispatched).not.toContain(pause.type);
    expect(audio.pause).toHaveBeenCalled();
    // a source left behind keeps the lock screen entry alive
    expect(audio.removeAttribute).toHaveBeenCalledWith('src');
    expect(audio.loads).toBe(1);
  });

  it('does nothing over a player that is already closed', () => {
    store.dispatch(closePlayer());

    expect(dispatched).toEqual([closePlayer.type]);
    expect(audio.pause).not.toHaveBeenCalled();
  });

  it('ignores a play without a book', () => {
    store.dispatch(play());

    expect(audio.play).not.toHaveBeenCalled();
    expect(store.getState().player.state.playing).toBe(false);
  });

  it('ignores a pause without a book', () => {
    store.dispatch(playerSlice.actions.updatePosition(120));
    audio.currentTime = 120;

    store.dispatch(pause());

    expect(audio.pause).not.toHaveBeenCalled();
    // the pause of a playing book moves the position five seconds back
    expect(audio.currentTime).toBe(120);
    expect(store.getState().player.state.position).toBe(120);
  });

  it('silences the previous book when the next one has no chapters', () => {
    openBook();

    store.dispatch(playerSlice.actions.playerSetup({ bookId: 'empty', chapters: [] }));

    // the load that would silence it is never started for a book without chapters
    expect(audio.pause).toHaveBeenCalled();
  });

  it('asks the load to start the playback instead of a play of its own', () => {
    store.dispatch(playerSlice.actions.playerSetup({ bookId: 'book', chapters, playing: true }));

    expect(store.getState().player.state.playing).toBe(true);
    // a play over a chapter without duration is a retry and would load it a second time
    expect(dispatched).toContain(loadChapter.type);
    expect(dispatched).not.toContain(play.type);
  });

  it('opens a book on pause by default', () => {
    store.dispatch(playerSlice.actions.playerSetup({ bookId: 'book', chapters }));

    expect(store.getState().player.state.playing).toBe(false);
  });

  it('reloads the last chapter when the one being played is gone', () => {
    openBook();
    store.dispatch(playerSlice.actions.updateCurrentChapter(1));
    dispatched = [];

    store.dispatch(updateChapters(chapters.slice(0, 1)));

    // its number would otherwise be published under a chapter that no longer exists
    expect(dispatched).toContain(loadChapter.type);
  });

  it('leaves the chapter alone while it is still there', () => {
    openBook();

    store.dispatch(updateChapters(chapters));

    expect(dispatched).not.toContain(loadChapter.type);
  });
});
