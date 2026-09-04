export interface DiagnosticsEntry {
  at: string;
  kind: 'event' | 'action';
  name: string;
  [detail: string]: unknown;
}

export interface DiagnosticsLogOptions {
  send(entries: DiagnosticsEntry[]): boolean;
  storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
  maxBytes?: number;
}

const storageKey = 'playerDiagnostics';
const persistInterval = 250;

// the buffer outlives the tab on purpose, see docs/ai/frontend/player.md, "Диагностика"
const createDiagnosticsLog = ({ send, storage, maxBytes = 24000 }: DiagnosticsLogOptions) => {
  const read = () => {
    try {
      const saved: unknown = JSON.parse(storage.getItem(storageKey) ?? '[]');
      return Array.isArray(saved) ? (saved as DiagnosticsEntry[]) : [];
    } catch {
      return [];
    }
  };

  const encoder = new TextEncoder();
  // the buffer travels as a JSON array, so an entry costs its own bytes plus the separator
  const measure = (entry: DiagnosticsEntry) => encoder.encode(JSON.stringify(entry)).length + 1;

  let entries = read();
  let bytes = entries.reduce((total, entry) => total + measure(entry), 0);
  // the enclosing brackets take the byte the last separator does not
  const bodyBytes = () => bytes + 1;

  const trim = () => {
    while (entries.length > 1 && bodyBytes() > maxBytes) {
      bytes -= measure(entries[0]);
      entries.shift();
    }
  };

  trim();

  let pendingPersist: ReturnType<typeof setTimeout> | undefined;

  const write = () => {
    clearTimeout(pendingPersist);
    pendingPersist = undefined;

    try {
      storage.setItem(storageKey, JSON.stringify(entries));
    } catch {
      // a full storage must never break playback
    }
  };

  // never synchronous: a chapter switch is a burst of entries in the same task as play(),
  // and serializing the buffer there would add jank to the very run being measured
  const persist = () => {
    pendingPersist ??= setTimeout(write, persistInterval);
  };

  return {
    get size() {
      return entries.length;
    },

    record(entry: DiagnosticsEntry) {
      entries.push(entry);
      bytes += measure(entry);
      trim();

      persist();
    },

    replaceLast(entry: DiagnosticsEntry) {
      const last = entries.pop();
      if (last) bytes -= measure(last);

      this.record(entry);
    },

    get last(): DiagnosticsEntry | undefined {
      return entries[entries.length - 1];
    },

    flush() {
      if (entries.length === 0) return true;

      const sent = () => {
        try {
          return send(entries);
        } catch {
          // a broken transport must not take the buffer with it
          return false;
        }
      };

      if (!sent()) {
        write();
        return false;
      }

      entries = [];
      bytes = 0;
      clearTimeout(pendingPersist);
      pendingPersist = undefined;
      try {
        storage.removeItem(storageKey);
      } catch {
        // nothing to do: the buffer is already empty
      }

      return true;
    },
  };
};

export default createDiagnosticsLog;
