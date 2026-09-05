import { configureStore, createListenerMiddleware, ListenerMiddlewareInstance, Middleware } from '@reduxjs/toolkit';
import i18next from 'i18next';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import addLoadChapterAction from './addLoadChapterAction';
import addPlayerUpdates from './addPlayerUpdates';
import addPositionAction from './addPositionAction';
import addPlayPauseActions from './addPlayPauseActions';
import addChapterEndAction from './addChapterEndAction';
import addAudioEventListeners from './addAudioEventListeners';
import addOtherPlayerActions from './addOtherPlayerActions';
import addForwardAction from './addForwardAction';
import addRewindAction from './addRewindAction';
import { playerReset, playerSlice, setPauseOnChapterEnd, setRewindOnPause } from '../slice';
import { chapterEnded, loadChapter, playbackStalled, retryChapter, startUpdates, stopUpdates } from '../internal';
import { changePosition, chapterChange, forward, nextChapter, pause, play, previousChapter, rewind } from '../actions';
import type { PlayerStateSlice } from '..';

const chapters = [
  { title: 'one', filename: 'one.mp3', duration: 600 },
  { title: 'two', filename: 'two.mp3', duration: 300 },
  { title: 'no duration', filename: 'three.mp3' },
];

/**
 * Mimics a browser that drops currentTime set before the metadata arrived: that is the case
 * the correction after loadedmetadata exists for.
 */
class FakeAudio {
  src = '';
  readyState = 0;
  onpause: (() => void) | null = null;
  onplay: (() => void) | null = null;
  onerror: (() => void) | null = null;
  duration = NaN;
  error: MediaError | null = null;
  paused = true;
  play = vi.fn(() => {
    // an unusable source is refused before anything is reported, every other state goes on
    if (this.error?.code === 4)
      return Promise.reject(Object.assign(new Error('refused'), { name: 'NotSupportedError' }));

    // an element that is already going reports nothing: it only settles the promises it owes
    if (!this.paused) return Promise.resolve();

    this.paused = false;
    this.emit('play');
    if (this.readyState >= 3) this.emit('playing');

    return Promise.resolve();
  });

  pause = vi.fn(() => {
    const played = !this.paused;
    this.paused = true;

    if (played) {
      this.abortPlayback();
      this.emit('pause');
    }
  });

  private pendingPlay: ((reason: Error) => void) | undefined;

  // load() and pause() reject a play() that has not answered yet, and they name it AbortError
  private abortPlayback() {
    this.pendingPlay?.(Object.assign(new Error('interrupted'), { name: 'AbortError' }));
    this.pendingPlay = undefined;
  }

  /** Keeps the next play() unanswered, the way a browser does until the sound actually starts. */
  holdPlayback() {
    this.play.mockImplementationOnce(() => {
      this.paused = false;
      return new Promise<void>((_, reject) => {
        this.pendingPlay = reject;
      });
    });

    return (name: string) => {
      if (!this.pendingPlay) throw new Error('no playback is waiting for an answer');

      const reject = this.pendingPlay;
      this.pendingPlay = undefined;
      reject(Object.assign(new Error(name), { name }));
    };
  }

  private time = 0;
  private loaded = false;
  private listeners = new Map<string, Set<() => void>>();

  get currentTime() {
    return this.time;
  }

  seeks = 0;
  mutedToggles = 0;
  private mutedValue = false;

  set muted(value: boolean) {
    if (value !== this.mutedValue) this.mutedToggles += value ? 1 : 0;
    this.mutedValue = value;
  }

  get muted() {
    return this.mutedValue;
  }

  set currentTime(value: number) {
    this.seeks += 1;
    if (this.loaded) this.time = value;
  }

  loads = 0;

  load() {
    this.loads += 1;
    this.abortPlayback();
    this.error = null;
    this.loaded = false;
    this.paused = true;
    this.readyState = 0;
    this.time = 0;
    this.duration = NaN;
  }

  // a real element raises its state before the event is delivered, and the interval can tick
  // in between: that gap is what the store based barrier exists for
  metadataReady(duration: number) {
    this.loaded = true;
    this.readyState = 1;
    this.duration = duration;
  }

  /** Metadata alone gives no sound: a real element reports playing once it has data ahead. */
  dataArrived() {
    this.readyState = 4;
    this.emit('canplay');

    if (!this.paused) this.emit('playing');
  }

  metadataArrived(duration: number) {
    this.metadataReady(duration);
    this.emit('loadedmetadata');
  }

  endedEvent() {
    this.paused = true;
    this.emit('pause');
    this.emit('ended');
  }

  pauseEvent() {
    this.emit('pause');
  }

  holdPosition(value: number) {
    this.time = value;
  }

  /** Playing without moving: an element that answered a play but got no audio session. */
  stall() {
    this.paused = false;
    this.readyState = 4;
  }

  failed(code: number, message: string) {
    this.error = { code, message } as MediaError;
    this.emit('error');
  }

  addEventListener(type: string, listener: () => void) {
    const set = this.listeners.get(type) ?? new Set();
    set.add(listener);
    this.listeners.set(type, set);
  }

  removeEventListener(type: string, listener: () => void) {
    this.listeners.get(type)?.delete(listener);
  }

  // a real element orders both handlers by the moment each was registered; here the property one
  // always goes first, which is the order the load path sees
  private emit(type: string) {
    (this as unknown as Record<string, (() => void) | null>)[`on${type}`]?.();
    this.listeners.get(type)?.forEach(listener => listener());
  }
}

// the continuation after the metadata promise runs in a microtask
const flush = async () => {
  for (let step = 0; step < 5; step++) await Promise.resolve();
};

describe('player listeners', () => {
  // the middleware reports errors through t(): without init it returns undefined
  beforeAll(async () => {
    await i18next.init({ lng: 'en', resources: {} });
  });

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

  const playerState = () => store.getState().player.state;

  beforeEach(() => {
    vi.stubGlobal('HTMLMediaElement', {
      HAVE_NOTHING: 0,
      HAVE_METADATA: 1,
      HAVE_CURRENT_DATA: 2,
      HAVE_FUTURE_DATA: 3,
      HAVE_ENOUGH_DATA: 4,
    });
    audio = new FakeAudio();
    const mw = createListenerMiddleware<PlayerStateSlice>();
    addLoadChapterAction(mw, audio as unknown as HTMLAudioElement);
    addPlayerUpdates(mw, audio as unknown as HTMLAudioElement);
    addPositionAction(mw, audio as unknown as HTMLAudioElement);
    addPlayPauseActions(mw, audio as unknown as HTMLAudioElement);
    addChapterEndAction(mw, audio as unknown as HTMLAudioElement);
    addAudioEventListeners(mw, audio as unknown as HTMLAudioElement);
    addOtherPlayerActions(mw, audio as unknown as HTMLAudioElement);
    addForwardAction(mw, audio as unknown as HTMLAudioElement);
    addRewindAction(mw, audio as unknown as HTMLAudioElement);
    store = createStore(mw);
    store.dispatch(playerSlice.actions.playerSetup({ bookId: 'book', chapters }));
    dispatched = [];
  });

  // the interval outlives a test that left the player playing, and its body reads the globals
  afterEach(() => {
    store.dispatch(stopUpdates());
    vi.unstubAllGlobals();
  });

  it('sets the position before the metadata and the duration after it', async () => {
    store.dispatch(loadChapter({ number: 1, position: 30 }));

    expect(audio.src).toBe('two.mp3');
    expect(playerState().currentChapter).toBe(1);
    expect(playerState().position).toBe(30);
    expect(playerState().duration).toBeUndefined();

    audio.metadataArrived(300);
    await flush();

    expect(playerState().duration).toBe(300);
  });

  it('re-applies the position the element dropped', async () => {
    store.dispatch(loadChapter({ number: 1, position: 30 }));

    audio.metadataArrived(300);
    await flush();

    expect(audio.currentTime).toBe(30);
    expect(playerState().position).toBe(30);
  });

  it('counts a negative position from the chapter duration right away', async () => {
    store.dispatch(loadChapter({ number: 0, position: -7 }));

    expect(playerState().position).toBe(593);

    audio.metadataArrived(601);
    await flush();

    expect(playerState().position).toBe(594);
  });

  it('starts from zero when the chapter duration is unknown', () => {
    store.dispatch(changePosition(200));

    store.dispatch(loadChapter({ number: 2, position: -7 }));

    expect(playerState().position).toBe(0);
  });

  it('keeps the position the user changed while the chapter was loading', async () => {
    store.dispatch(loadChapter({ number: 0, position: -7 }));

    store.dispatch(changePosition(100));

    audio.metadataArrived(601);
    await flush();

    expect(playerState().position).toBe(100);
    expect(audio.currentTime).toBe(100);
  });

  it('clamps a position beyond the chapter', async () => {
    store.dispatch(loadChapter({ number: 1, position: 5000 }));

    audio.metadataArrived(300);
    await flush();

    expect(playerState().position).toBe(300);
  });

  it('reports a failed load and stops playing', async () => {
    store.dispatch(playerSlice.actions.updatePlaying(true));
    store.dispatch(loadChapter({ number: 1, position: 0 }));

    audio.failed(4, 'not supported');
    await flush();

    expect(playerState().playing).toBe(false);
    expect(playerState().error).toBe("Can't load chapter");
  });

  it('does not overwrite the start position while the duration is unknown', async () => {
    vi.useFakeTimers();
    try {
      store.dispatch(playerSlice.actions.updatePlaying(true));
      store.dispatch(loadChapter({ number: 1, position: 30 }));

      await vi.advanceTimersByTimeAsync(3000);

      expect(playerState().position).toBe(30);

      audio.metadataArrived(300);
      await vi.advanceTimersByTimeAsync(0);

      expect(playerState().position).toBe(30);
    } finally {
      vi.useRealTimers();
    }
  });
  it('cancels a load that a newer one replaced', async () => {
    store.dispatch(loadChapter({ number: 1, position: 30 }));
    store.dispatch(loadChapter({ number: 0, position: -7 }));

    dispatched = [];
    audio.metadataArrived(601);
    await flush();

    expect(playerState().currentChapter).toBe(0);
    expect(playerState().position).toBe(594);
    // the replaced load would report a duration of its own
    expect(dispatched.filter(type => type === 'player/updateDuration')).toHaveLength(1);
  });

  // play() answers later than the load effect ends, see docs/ai/frontend/player.md, "Ошибки"
  it('reports a playback failure that arrives after the load has finished', async () => {
    const fail = audio.holdPlayback();
    store.dispatch(playerSlice.actions.updatePlaying(true));
    store.dispatch(loadChapter({ number: 1, position: 0 }));
    audio.metadataArrived(300);
    await flush();

    fail('NotSupportedError');
    await flush();

    expect(playerState().error).toBe("Can't play chapter");
  });

  it('says nothing about a playback the next chapter replaced', async () => {
    audio.holdPlayback();
    store.dispatch(playerSlice.actions.updatePlaying(true));
    store.dispatch(loadChapter({ number: 1, position: 0 }));
    const playback = audio.play.mock.results[0].value as Promise<void>;

    store.dispatch(loadChapter({ number: 0, position: 0 }));

    // the load of the next chapter is what rejects this playback, and it has to be seen rejecting
    await expect(playback).rejects.toMatchObject({ name: 'AbortError' });
    await flush();

    expect(playerState().error).toBe('');
  });

  // addPlayerSetupActions is out of this store, so playerReset leaves the element alone and the
  // rejection keeps the name it was given, see docs/ai/frontend/player.md, "Ошибки"
  it('says nothing about a playback of a book that was closed', async () => {
    const fail = audio.holdPlayback();
    store.dispatch(playerSlice.actions.updatePlaying(true));
    store.dispatch(loadChapter({ number: 1, position: 0 }));
    store.dispatch(playerReset());

    fail('NotSupportedError');
    await flush();

    expect(playerState().error).toBe('');
  });

  it('publishes the position while the element reports an unusable duration', async () => {
    vi.useFakeTimers();
    try {
      store.dispatch(playerSlice.actions.updatePlaying(true));
      store.dispatch(loadChapter({ number: 1, position: 30 }));
      audio.metadataArrived(300);
      await vi.advanceTimersByTimeAsync(0);

      audio.duration = Infinity;
      audio.holdPosition(42);
      await vi.advanceTimersByTimeAsync(1000);

      expect(playerState().position).toBe(42);
      expect(playerState().duration).toBe(300);
    } finally {
      vi.useRealTimers();
    }
  });

  it('drops the duration when the element lost its resource', async () => {
    vi.useFakeTimers();
    try {
      store.dispatch(playerSlice.actions.updatePlaying(true));
      store.dispatch(loadChapter({ number: 1, position: 30 }));
      audio.metadataArrived(300);
      await vi.advanceTimersByTimeAsync(0);

      audio.readyState = 0;
      audio.duration = NaN;
      await vi.advanceTimersByTimeAsync(1000);

      expect(playerState().duration).toBeUndefined();
    } finally {
      vi.useRealTimers();
    }
  });

  it('ignores a chapter number that is not a whole one', () => {
    store.dispatch(chapterChange(1.5));

    // a fractional number gets no chapter of its own, so only the request tells the guards apart
    expect(dispatched).not.toContain(loadChapter.type);
  });

  it('reports a failure that came after the chapter had loaded', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      store.dispatch(playerSlice.actions.updatePlaying(true));
      store.dispatch(loadChapter({ number: 1, position: 0 }));
      audio.metadataArrived(300);
      await flush();

      dispatched = [];
      audio.failed(2, 'network');

      expect(playerState().playing).toBe(false);
      expect(playerState().error).toBe("Can't play chapter");
      expect(dispatched).toContain(stopUpdates.type);
    } finally {
      error.mockRestore();
    }
  });

  it('stops at the end of a chapter when the sleep timer asked for it', () => {
    store.dispatch(playerSlice.actions.updatePlaying(true));
    store.dispatch(loadChapter({ number: 0, position: 0 }));
    store.dispatch(setPauseOnChapterEnd(true));

    store.dispatch(chapterEnded());

    expect(playerState().currentChapter).toBe(1);
    expect(playerState().playing).toBe(false);
    expect(playerState().pauseOnChapterEnd).toBe(false);
  });

  it('ignores a chapter number outside the book', () => {
    store.dispatch(chapterChange(-1));
    store.dispatch(chapterChange(chapters.length));

    expect(dispatched).not.toContain(loadChapter.type);
  });

  // straight from the element: the play action raises the flag itself, so through it the store
  // would look right even with the event ignored
  it('follows the element into playing', async () => {
    store.dispatch(loadChapter({ number: 1, position: 0 }));
    audio.metadataArrived(300);
    await flush();
    store.dispatch(playerSlice.actions.updatePlaying(false));

    dispatched = [];
    audio.play();
    audio.dataArrived();

    expect(playerState().playing).toBe(true);
    expect(dispatched).toContain(startUpdates.type);
  });

  it('follows the element into a pause', async () => {
    store.dispatch(loadChapter({ number: 1, position: 0 }));
    audio.metadataArrived(300);
    await flush();
    audio.play();
    audio.dataArrived();

    dispatched = [];
    audio.pause();

    expect(playerState().playing).toBe(false);
    expect(dispatched).toContain(stopUpdates.type);
  });

  it('retries a failed chapter when the element is asked to play', async () => {
    store.dispatch(loadChapter({ number: 1, position: 0 }));
    audio.failed(2, 'network');
    await flush();
    expect(playerState().error).toBe("Can't load chapter");

    const loads = audio.loads;
    audio.play.mockClear();
    audio.play();
    await flush();

    expect(audio.loads).toBe(loads + 1);
    expect(playerState().error).toBe('');
    // the reload has to sound, otherwise the press is as lost as it was before
    expect(playerState().playing).toBe(true);
    expect(audio.play).toHaveBeenCalledTimes(2);
  });

  it('retries a chapter that broke mid playback', async () => {
    const logged = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      store.dispatch(playerSlice.actions.updatePlaying(true));
      store.dispatch(loadChapter({ number: 1, position: 0 }));
      audio.metadataArrived(300);
      await flush();
      audio.dataArrived();
      audio.failed(2, 'network');

      const loads = audio.loads;
      audio.play();
      await flush();

      expect(audio.loads).toBe(loads + 1);
      expect(playerState().error).toBe('');
    } finally {
      logged.mockRestore();
    }
  });

  it('does not answer its own playback with another load', async () => {
    store.dispatch(playerSlice.actions.updatePlaying(true));

    dispatched = [];
    store.dispatch(loadChapter({ number: 1, position: 0 }));
    await flush();

    // the load asks the element to play while the duration is unknown: a wider condition in the
    // play handler would answer that with a reload, and so on without end
    expect(audio.play).toHaveBeenCalledTimes(1);
    expect(dispatched).not.toContain(retryChapter.type);
    expect(audio.loads).toBe(1);
  });

  it('keeps publishing at its own pace when playback is asked for again', async () => {
    vi.useFakeTimers();
    try {
      store.dispatch(playerSlice.actions.updatePlaying(true));
      store.dispatch(loadChapter({ number: 1, position: 0 }));
      audio.metadataArrived(300);
      await vi.advanceTimersByTimeAsync(0);

      await vi.advanceTimersByTimeAsync(900);
      audio.holdPosition(42);
      store.dispatch(startUpdates());
      dispatched = [];
      await vi.advanceTimersByTimeAsync(100);

      // a restarted interval would put the publication off by another second
      expect(dispatched).toContain('player/updatePosition');
    } finally {
      vi.useRealTimers();
    }
  });

  it('steps back five seconds on a pause', async () => {
    store.dispatch(loadChapter({ number: 1, position: 100 }));
    audio.metadataArrived(300);
    await flush();

    store.dispatch(pause());

    expect(playerState().position).toBe(95);
    expect(audio.currentTime).toBe(95);
  });

  it('touches nothing on a pause when the step back is switched off', async () => {
    store.dispatch(setRewindOnPause(false));
    store.dispatch(loadChapter({ number: 1, position: 100 }));
    audio.metadataArrived(300);
    await flush();

    const seeks = audio.seeks;
    store.dispatch(pause());

    expect(playerState().position).toBe(100);
    // not just the same value: a seek of a hidden element may be what costs it the sound
    expect(audio.seeks).toBe(seeks);
  });

  it('reports playback that says it goes and stays where it is', async () => {
    vi.useFakeTimers();
    try {
      store.dispatch(playerSlice.actions.updatePlaying(true));
      store.dispatch(loadChapter({ number: 1, position: 30 }));
      audio.metadataArrived(300);
      await vi.advanceTimersByTimeAsync(0);
      audio.stall();

      dispatched = [];
      // the first tick only takes the reading the next ones are compared against
      await vi.advanceTimersByTimeAsync(3000);
      expect(dispatched).not.toContain(playbackStalled.type);

      await vi.advanceTimersByTimeAsync(2000);

      expect(dispatched.filter(type => type === playbackStalled.type)).toHaveLength(1);
      // the only path in webkit that asks for the audio session again
      expect(audio.mutedToggles).toBe(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it('says nothing about playback that moves', async () => {
    vi.useFakeTimers();
    try {
      store.dispatch(playerSlice.actions.updatePlaying(true));
      store.dispatch(loadChapter({ number: 1, position: 30 }));
      audio.metadataArrived(300);
      await vi.advanceTimersByTimeAsync(0);
      audio.stall();

      dispatched = [];
      for (let second = 1; second <= 4; second += 1) {
        audio.holdPosition(30 + second);
        await vi.advanceTimersByTimeAsync(1000);
      }

      expect(dispatched).not.toContain(playbackStalled.type);
      expect(audio.mutedToggles).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it('starts counting the standstill over when the position moves', async () => {
    vi.useFakeTimers();
    try {
      store.dispatch(playerSlice.actions.updatePlaying(true));
      store.dispatch(loadChapter({ number: 1, position: 30 }));
      audio.metadataArrived(300);
      await vi.advanceTimersByTimeAsync(0);
      audio.stall();

      dispatched = [];
      await vi.advanceTimersByTimeAsync(3000);
      audio.holdPosition(31);
      await vi.advanceTimersByTimeAsync(1000);
      await vi.advanceTimersByTimeAsync(2000);

      // two standstills of two seconds are not one of four
      expect(dispatched).not.toContain(playbackStalled.type);
    } finally {
      vi.useRealTimers();
    }
  });

  it('ignores the playing event of a closed book', async () => {
    store.dispatch(loadChapter({ number: 1, position: 0 }));
    audio.metadataArrived(300);
    await flush();
    store.dispatch(playerReset());

    dispatched = [];
    audio.play();
    audio.dataArrived();

    expect(dispatched).not.toContain(startUpdates.type);
  });

  it('moves inside the chapter while it has room', async () => {
    store.dispatch(loadChapter({ number: 1, position: 0 }));
    audio.metadataArrived(300);
    await flush();
    store.dispatch(changePosition(100));

    store.dispatch(forward(30));
    expect(playerState().position).toBe(130);

    store.dispatch(rewind(50));
    expect(playerState().position).toBe(80);
  });

  it('ignores a forward over a chapter whose duration is unknown', () => {
    store.dispatch(loadChapter({ number: 1, position: 30 }));

    dispatched = [];
    store.dispatch(forward(30));

    expect(dispatched).not.toContain('player/changePosition');
    expect(playerState().position).toBe(30);
  });

  it('carries a forward past the chapter end into the next one', async () => {
    store.dispatch(loadChapter({ number: 1, position: 0 }));
    audio.metadataArrived(300);
    await flush();
    store.dispatch(changePosition(290));

    store.dispatch(forward(30));

    expect(playerState().currentChapter).toBe(2);
    expect(playerState().position).toBe(20);
  });

  it('stops a forward at the end of the last chapter', async () => {
    store.dispatch(loadChapter({ number: 2, position: 0 }));
    audio.metadataArrived(300);
    await flush();
    store.dispatch(changePosition(290));

    dispatched = [];
    store.dispatch(forward(30));

    // a load of the chapter past the last one would end before it changed the number
    expect(dispatched).not.toContain(loadChapter.type);
    expect(playerState().position).toBe(300);
  });

  it('carries a rewind past the chapter start into the previous one', async () => {
    store.dispatch(loadChapter({ number: 1, position: 0 }));
    audio.metadataArrived(300);
    await flush();
    store.dispatch(changePosition(10));

    store.dispatch(rewind(30));

    expect(playerState().currentChapter).toBe(0);
    // counted from the end of the chapter the player moved back into
    expect(playerState().position).toBe(580);
  });

  it('stops a rewind at the start of the first chapter', async () => {
    store.dispatch(loadChapter({ number: 0, position: 10 }));
    audio.metadataArrived(600);
    await flush();

    dispatched = [];
    store.dispatch(rewind(30));

    expect(dispatched).not.toContain(loadChapter.type);
    expect(playerState().position).toBe(0);
  });

  it('does nothing past the last chapter', () => {
    store.dispatch(loadChapter({ number: 2, position: 0 }));

    dispatched = [];
    store.dispatch(nextChapter());

    expect(dispatched).not.toContain(loadChapter.type);
  });

  it('rewinds the first chapter instead of leaving it', () => {
    store.dispatch(loadChapter({ number: 0, position: 30 }));

    dispatched = [];
    store.dispatch(previousChapter());

    expect(dispatched).not.toContain(loadChapter.type);
    expect(playerState().position).toBe(0);
  });

  it('leaves a draft book at its last chapter', () => {
    store.dispatch(playerSlice.actions.setBookInfo({ name: 'book', author: 'author', draft: true }));
    store.dispatch(playerSlice.actions.updatePlaying(true));
    store.dispatch(loadChapter({ number: 2, position: 0 }));

    audio.play.mockClear();
    const loads = audio.loads;
    store.dispatch(chapterEnded());

    expect(playerState().currentChapter).toBe(2);
    expect(audio.loads).toBe(loads);
    expect(playerState().playing).toBe(false);
  });

  it('requests the playback before the metadata arrives', () => {
    store.dispatch(playerSlice.actions.updatePlaying(true));
    store.dispatch(loadChapter({ number: 1, position: 30 }));

    expect(audio.play).toHaveBeenCalledTimes(1);
  });

  it('drops a known duration when the next chapter starts loading', async () => {
    vi.useFakeTimers();
    try {
      store.dispatch(playerSlice.actions.updatePlaying(true));
      store.dispatch(loadChapter({ number: 1, position: 30 }));
      audio.metadataArrived(300);
      await vi.advanceTimersByTimeAsync(0);
      expect(playerState().duration).toBe(300);

      store.dispatch(loadChapter({ number: 0, position: 50 }));

      expect(playerState().duration).toBeUndefined();

      await vi.advanceTimersByTimeAsync(3000);

      expect(playerState().position).toBe(50);
    } finally {
      vi.useRealTimers();
    }
  });

  it('repeats the original request when play retries a chapter without metadata', async () => {
    store.dispatch(loadChapter({ number: 2, position: -7 }));
    expect(playerState().position).toBe(0);

    store.dispatch(play());

    expect(audio.loads).toBe(2);

    audio.metadataArrived(600);
    await flush();

    expect(playerState().currentChapter).toBe(2);
    expect(playerState().position).toBe(593);
  });
  it('repeats the request after a failed load', async () => {
    store.dispatch(playerSlice.actions.updatePlaying(true));
    store.dispatch(loadChapter({ number: 1, position: 30 }));

    audio.failed(2, 'network');
    await flush();
    expect(playerState().error).toBeTruthy();

    store.dispatch(play());

    expect(playerState().error).toBe('');

    expect(audio.loads).toBe(2);

    audio.metadataArrived(300);
    await flush();

    // only a fresh load answers the metadata
    expect(playerState().duration).toBe(300);
    expect(playerState().position).toBe(30);
  });

  it('retries from the current position once the chapter has loaded', async () => {
    store.dispatch(loadChapter({ number: 0, position: -7 }));
    audio.metadataArrived(601);
    await flush();
    expect(playerState().position).toBe(594);

    store.dispatch(changePosition(120));
    store.dispatch(playerSlice.actions.setError('failed'));
    store.dispatch(play());

    expect(playerState().duration).toBeUndefined();

    audio.metadataArrived(601);
    await flush();

    expect(playerState().duration).toBe(601);
    expect(playerState().position).toBe(120);
  });

  it('keeps a position the user changed while the load was hanging', async () => {
    store.dispatch(loadChapter({ number: 0, position: -7 }));
    expect(playerState().position).toBe(593);

    store.dispatch(changePosition(120));
    store.dispatch(play());

    expect(audio.loads).toBe(2);

    audio.metadataArrived(601);
    await flush();

    expect(playerState().position).toBe(120);
  });
  it('does not publish a position while the finished chapter still owns the duration', async () => {
    store.dispatch(playerSlice.actions.updatePlaying(true));
    store.dispatch(loadChapter({ number: 0, position: 30 }));
    audio.metadataArrived(600);
    await flush();

    dispatched = [];
    store.dispatch(chapterEnded());

    // a zero written before the duration is dropped would leave the server at the beginning
    // of the chapter that just ended
    const dropped = dispatched.indexOf('player/updateDuration');
    const renumbered = dispatched.indexOf('player/updateCurrentChapter');
    const moved = dispatched.indexOf('player/updatePosition');

    // the websocket is held back by the dropped duration, localStorage only by the order:
    // it saves on any change of player state
    expect(moved).toBeGreaterThan(dropped);
    expect(moved).toBeGreaterThan(renumbered);
  });
  it('ignores a pause reported before the chapter has any data', () => {
    store.dispatch(playerSlice.actions.updatePlaying(true));
    store.dispatch(loadChapter({ number: 1, position: 0 }));

    dispatched = [];
    audio.pauseEvent();

    expect(playerState().playing).toBe(true);
    // the load has just started the updates, and this pause is its own
    expect(dispatched).not.toContain(stopUpdates.type);
  });

  it('leaves a failed load to report itself', async () => {
    store.dispatch(loadChapter({ number: 1, position: 0 }));

    dispatched = [];
    audio.failed(4, 'not supported');
    await flush();

    expect(playerState().error).toBe("Can't load chapter");
    // one failure, one message: the element handler leaves it to the load
    expect(dispatched.filter(type => type === 'player/setError')).toHaveLength(1);
  });

  it('silences an element that is already sounding when the chapter turns out unusable', async () => {
    store.dispatch(playerSlice.actions.updatePlaying(true));
    store.dispatch(loadChapter({ number: 1, position: 0 }));

    expect(audio.paused).toBe(false);

    audio.metadataArrived(Infinity);
    await flush();

    expect(audio.pause).toHaveBeenCalled();
    expect(playerState().playing).toBe(false);
    expect(playerState().error).toBe("Can't load chapter");
  });

  it('keeps a position the element held on to', async () => {
    store.dispatch(loadChapter({ number: 1, position: 30 }));

    dispatched = [];
    audio.holdPosition(30);
    audio.metadataArrived(300);
    await flush();

    expect(playerState().position).toBe(30);
    expect(dispatched).not.toContain('player/changePosition');
  });
  it('holds the position between the element knowing the duration and saying so', async () => {
    vi.useFakeTimers();
    try {
      store.dispatch(playerSlice.actions.updatePlaying(true));
      store.dispatch(loadChapter({ number: 1, position: 30 }));

      // the element knows, the event has not been delivered yet
      audio.metadataReady(300);
      await vi.advanceTimersByTimeAsync(3000);

      expect(playerState().position).toBe(30);
    } finally {
      vi.useRealTimers();
    }
  });

  it('resumes playing after the pause that precedes the end of a chapter', async () => {
    store.dispatch(playerSlice.actions.updatePlaying(true));
    store.dispatch(loadChapter({ number: 0, position: 0 }));
    audio.metadataArrived(600);
    await flush();

    audio.play.mockClear();
    audio.endedEvent();

    expect(playerState().currentChapter).toBe(1);
    expect(audio.play).toHaveBeenCalledTimes(1);
  });

  // chapterEnded goes straight in: the pause the element sends before ended stops the playback
  // on its own, and through it the branch below would be green even with the stop removed
  it('stops at the end of the book and rewinds it', async () => {
    store.dispatch(playerSlice.actions.updatePlaying(true));
    store.dispatch(loadChapter({ number: 2, position: 0 }));
    audio.metadataArrived(600);
    await flush();

    audio.play.mockClear();
    dispatched = [];
    store.dispatch(chapterEnded());

    expect(playerState().currentChapter).toBe(0);
    expect(playerState().playing).toBe(false);
    expect(audio.play).not.toHaveBeenCalled();
    // the rewinding load stops the updates too, so only the order tells the two apart
    expect(dispatched.indexOf(stopUpdates.type)).toBeLessThan(dispatched.indexOf(loadChapter.type));
  });
});
