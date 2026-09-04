import i18next from 'i18next';
import { UnknownAction } from '@reduxjs/toolkit';
import { beforeAll, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import startPlayback from './startPlayback';
import { playerSlice } from '../slice';
import { showMessage } from '../actions';
import { stopUpdates } from '../internal';

const rejecting = (name: string, error: MediaError | null = null) =>
  ({
    error,
    src: 'one.mp3',
    play: () => Promise.reject(Object.assign(new Error(name), { name })),
  }) as unknown as HTMLAudioElement;

// the rejection is handled in a microtask
const settled = async () => {
  for (let step = 0; step < 5; step++) await Promise.resolve();
};

describe('startPlayback', () => {
  let dispatch: Mock<(action: UnknownAction) => UnknownAction>;

  const dispatched = () => dispatch.mock.calls.map(([action]) => action);

  beforeAll(async () => {
    await i18next.init({ lng: 'en', resources: {} });
  });

  beforeEach(() => {
    dispatch = vi.fn<(action: UnknownAction) => UnknownAction>(action => action);
  });

  it('says nothing when a later load has replaced this one', async () => {
    startPlayback(rejecting('SomeOtherError'), dispatch as never, () => false);
    await settled();

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('reports a failure of the load that is still the current one', async () => {
    startPlayback(rejecting('SomeOtherError'), dispatch as never, () => true);
    await settled();

    expect(dispatched()).toContainEqual(playerSlice.actions.setError("Can't play chapter"));
  });

  it('says nothing while the source is being replaced', async () => {
    startPlayback(rejecting('AbortError'), dispatch as never);
    await settled();

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('says nothing when the load already reported the failure', async () => {
    startPlayback(rejecting('NotSupportedError', { code: 4 } as MediaError), dispatch as never);
    await settled();

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('asks to press play when the browser blocked the start', async () => {
    startPlayback(rejecting('NotAllowedError'), dispatch as never);

    await settled();

    expect(dispatched()).toEqual([
      playerSlice.actions.updatePlaying(false),
      stopUpdates(),
      showMessage({ text: 'Playback was blocked, press play to continue', severity: 'warning' }),
    ]);
  });

  it('reports anything else as an error', async () => {
    startPlayback(rejecting('SomeOtherError'), dispatch as never);
    await settled();

    expect(dispatched()).toContainEqual(playerSlice.actions.setError("Can't play chapter"));
  });
});
