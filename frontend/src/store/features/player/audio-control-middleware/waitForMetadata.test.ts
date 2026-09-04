import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import waitForMetadata from './waitForMetadata';

class FakeSource {
  duration = 0;
  error: MediaError | null = null;
  private listeners = new Map<string, Set<() => void>>();

  addEventListener(type: string, listener: () => void) {
    const set = this.listeners.get(type) ?? new Set();
    set.add(listener);
    this.listeners.set(type, set);
  }

  removeEventListener(type: string, listener: () => void) {
    this.listeners.get(type)?.delete(listener);
  }

  emit(type: string) {
    this.listeners.get(type)?.forEach(listener => listener());
  }

  get listenerCount() {
    return [...this.listeners.values()].reduce((total, set) => total + set.size, 0);
  }
}

describe('waitForMetadata', () => {
  let source: FakeSource;
  let controller: AbortController;
  let abortOn: ReturnType<typeof vi.spyOn>;
  let abortOff: ReturnType<typeof vi.spyOn>;

  const abortListener = () => abortOn.mock.calls[0][1];

  beforeEach(() => {
    vi.useFakeTimers();
    source = new FakeSource();
    controller = new AbortController();
    abortOn = vi.spyOn(controller.signal, 'addEventListener');
    abortOff = vi.spyOn(controller.signal, 'removeEventListener');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('resolves with the duration', async () => {
    const result = waitForMetadata(source, controller.signal);

    source.duration = 42;
    source.emit('loadedmetadata');

    await expect(result).resolves.toBe(42);
    expect(source.listenerCount).toBe(0);
    expect(abortOff).toHaveBeenCalledWith('abort', abortListener());
  });

  it('rejects with the media error details', async () => {
    const result = waitForMetadata(source, controller.signal);

    source.error = { code: 4, message: 'not supported' } as MediaError;
    source.emit('error');

    await expect(result).rejects.toThrow('media error 4: not supported');
    expect(source.listenerCount).toBe(0);
    expect(abortOff).toHaveBeenCalledWith('abort', abortListener());
  });

  it('rejects a duration the player cannot use', async () => {
    const result = waitForMetadata(source, controller.signal);

    source.duration = Infinity;
    source.emit('loadedmetadata');

    await expect(result).rejects.toThrow('unusable duration Infinity');
    expect(source.listenerCount).toBe(0);
    expect(abortOff).toHaveBeenCalledWith('abort', abortListener());
  });

  it('rejects on abort', async () => {
    const result = waitForMetadata(source, controller.signal);

    controller.abort(new Error('cancelled'));

    await expect(result).rejects.toThrow('cancelled');
    expect(source.listenerCount).toBe(0);
    expect(abortOff).toHaveBeenCalledWith('abort', abortListener());
  });

  it('never times out', async () => {
    const settled = vi.fn();

    waitForMetadata(source, controller.signal).then(settled, settled);
    await vi.advanceTimersByTimeAsync(60 * 60 * 1000);

    expect(settled).not.toHaveBeenCalled();
    expect(source.listenerCount).toBe(2);
  });
  it('rejects when the signal was already aborted', async () => {
    controller.abort(new Error('cancelled'));

    await expect(waitForMetadata(source, controller.signal)).rejects.toThrow('cancelled');
    expect(source.listenerCount).toBe(0);
  });
});
