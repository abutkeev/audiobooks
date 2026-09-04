import { v4 } from 'uuid';
import { DiagnosticsEntry } from './diagnosticsLog';

const endpoint = '/api/log';
const instanceKey = 'playerDiagnosticsInstance';

let seq = 0;

// an identifier of its own, not the websocket one, see docs/ai/frontend/player.md, "Диагностика"
const getDiagnosticsId = () => {
  try {
    const saved = localStorage.getItem(instanceKey);
    if (saved) return saved;

    const created = v4();
    localStorage.setItem(instanceKey, created);

    return created;
  } catch {
    return 'unknown';
  }
};

const sendDiagnostics = (entries: DiagnosticsEntry[]) => {
  const body = JSON.stringify({
    playerDiagnostics: {
      instance: getDiagnosticsId(),
      seq: (seq += 1),
      version: VERSION,
      userAgent: navigator.userAgent,
      entries,
    },
  });

  try {
    return navigator.sendBeacon(endpoint, new Blob([body], { type: 'application/json' }));
  } catch {
    // an unusable body or a document that is not fully active
    return false;
  }
};

export default sendDiagnostics;
