interface MetadataSource {
  readonly duration: number;
  readonly error: MediaError | null;
  addEventListener(type: string, listener: () => void): void;
  removeEventListener(type: string, listener: () => void): void;
}

/**
 * Waits for the duration without a timeout on purpose,
 * see docs/ai/frontend/player.md, "Переключение главы".
 */
const waitForMetadata = (source: MetadataSource, signal: AbortSignal) =>
  new Promise<number>((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason);
      return;
    }

    const finish = (action: () => void) => {
      source.removeEventListener('loadedmetadata', onLoaded);
      source.removeEventListener('error', onError);
      signal.removeEventListener('abort', onAbort);
      action();
    };

    const onLoaded = () =>
      finish(() =>
        isFinite(source.duration) ? resolve(source.duration) : reject(new Error(`unusable duration ${source.duration}`))
      );
    const onError = () =>
      finish(() => reject(new Error(`media error ${source.error?.code ?? 0}: ${source.error?.message ?? 'unknown'}`)));
    const onAbort = () => finish(() => reject(signal.reason));

    source.addEventListener('loadedmetadata', onLoaded);
    source.addEventListener('error', onError);
    signal.addEventListener('abort', onAbort);
  });

export default waitForMetadata;
