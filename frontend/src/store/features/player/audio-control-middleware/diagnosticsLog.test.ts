import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import createDiagnosticsLog, { DiagnosticsEntry } from './diagnosticsLog';

const entry = (name: string): DiagnosticsEntry => ({ at: '1970-01-01T00:00:00.000Z', kind: 'event', name });

class FakeStorage {
  private items = new Map<string, string>();

  getItem(key: string) {
    return this.items.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.items.set(key, value);
  }

  removeItem(key: string) {
    this.items.delete(key);
  }

  get keys() {
    return [...this.items.keys()];
  }
}

describe('createDiagnosticsLog', () => {
  let storage: FakeStorage;
  let send: Mock<(entries: DiagnosticsEntry[]) => boolean>;

  beforeEach(() => {
    storage = new FakeStorage();
    send = vi.fn<(entries: DiagnosticsEntry[]) => boolean>(() => true);
  });

  const create = (maxBytes?: number) => createDiagnosticsLog({ send, storage, maxBytes });

  it('sends what it recorded and empties the buffer', () => {
    const log = create();

    log.record(entry('ended'));
    log.record(entry('loadedmetadata'));

    expect(log.flush()).toBe(true);
    expect(send).toHaveBeenCalledWith([entry('ended'), entry('loadedmetadata')]);
    expect(log.size).toBe(0);
    expect(storage.keys).toHaveLength(0);
  });

  it('keeps the entries when sending failed', () => {
    send.mockReturnValue(false);
    const log = create();

    log.record(entry('ended'));

    expect(log.flush()).toBe(false);
    expect(log.size).toBe(1);
  });

  it('picks up what a previous session could not send', () => {
    vi.useFakeTimers();
    try {
      const first = create();
      first.record(entry('ended'));
      vi.advanceTimersByTime(1000);
    } finally {
      vi.useRealTimers();
    }

    const second = create();

    expect(second.size).toBe(1);
    second.flush();
    expect(send).toHaveBeenCalledWith([entry('ended')]);
  });

  it('drops the oldest entries past the size limit', () => {
    // exactly the body two entries make, so the third one cannot fit
    const log = create(JSON.stringify([entry('one'), entry('two')]).length);

    log.record(entry('one'));
    log.record(entry('two'));
    log.record(entry('six'));

    log.flush();

    expect(send).toHaveBeenCalledWith([entry('two'), entry('six')]);
  });

  it('measures bytes, not string length', () => {
    const cyrillic = { ...entry('ошибка'), payload: 'Не удалось загрузить главу' };
    // the pair fits when counted as UTF-16 units and does not when counted as bytes
    const maxBytes = JSON.stringify(cyrillic).length + JSON.stringify(entry('one')).length + 2;
    const log = createDiagnosticsLog({ send, storage, maxBytes });

    log.record(cyrillic);
    log.record(entry('one'));
    log.flush();

    expect(send).toHaveBeenCalledWith([entry('one')]);
  });

  it('counts the batch as the transport will see it', () => {
    const pair = JSON.stringify([entry('one'), entry('two')]).length;
    // one byte short of the pair: a buffer that forgets the brackets would send that byte anyway
    const log = create(pair - 1);

    log.record(entry('one'));
    log.record(entry('two'));
    log.flush();

    expect(send).toHaveBeenCalledWith([entry('two')]);
    const [batch] = send.mock.calls[0];
    expect(JSON.stringify(batch).length).toBeLessThanOrEqual(pair - 1);
  });

  it('keeps a batch the transport can accept', () => {
    const log = create(500);

    for (let step = 0; step < 100; step++) log.record(entry(`event ${step}`));
    log.flush();

    const [batch] = send.mock.calls[0];
    expect(JSON.stringify(batch).length).toBeLessThanOrEqual(500);
  });

  it('sends nothing when there is nothing to send', () => {
    expect(create().flush()).toBe(true);
    expect(send).not.toHaveBeenCalled();
  });

  it('writes a burst that a throttle would have skipped', () => {
    vi.useFakeTimers();
    try {
      const log = create();

      log.record(entry('one'));
      log.record(entry('two'));
      vi.advanceTimersByTime(1000);

      expect(JSON.parse(storage.getItem('playerDiagnostics') ?? '[]')).toHaveLength(2);
    } finally {
      vi.useRealTimers();
    }
  });

  it('survives a storage that throws', () => {
    const throwing = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
      removeItem: () => {
        throw new Error('blocked');
      },
    };
    const log = createDiagnosticsLog({ send, storage: throwing });

    log.record(entry('ended'));

    expect(log.size).toBe(1);
    expect(log.flush()).toBe(true);
  });
});
