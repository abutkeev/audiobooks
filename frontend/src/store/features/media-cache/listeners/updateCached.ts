import { ListenerMiddlewareInstance } from '@reduxjs/toolkit';
import mediaCacheSlice, { MediaCacheStateSlice, startMediaCacheUpdates, stopMediaCacheUpdates } from '..';
import { GetCache } from '../getListenerMiddleware';
import parseContentLength from '../parseContentLength';

const updateInterval = 1 * 60 * 1000;

const { updateCachedMedia } = mediaCacheSlice.actions;

type Dispatch = (action: ReturnType<typeof updateCachedMedia>) => void;

function addUpdateCacheListeners<State extends MediaCacheStateSlice>(
  mw: ListenerMiddlewareInstance<State>,
  getCache: GetCache
) {
  let intervalId: ReturnType<typeof setInterval> | undefined;
  let pendingUpdate: Promise<void> | undefined;
  let updateRequested = false;
  let sizes = new Map<string, number>();
  let dispatch: Dispatch | undefined;

  const getSize = async (cache: Cache, request: Request) => {
    const known = sizes.get(request.url);
    if (known !== undefined) return known;

    const size = parseContentLength((await cache.match(request))?.headers.get('content-length'));
    if (size !== undefined) {
      sizes.set(request.url, size);
    }
    return size;
  };

  const update = async () => {
    const cache = await getCache();
    const getKeys = async () => (await cache.keys()).filter(({ method }) => method === 'GET');

    // a chapter cached while sizes are read would be dropped by a snapshot taken before them
    await Promise.all((await getKeys()).map(request => getSize(cache, request)));
    const entries = await Promise.all(
      (await getKeys()).map(async request => ({ url: request.url, size: await getSize(cache, request) }))
    );
    sizes = new Map(entries.flatMap(({ url, size }) => (size === undefined ? [] : [[url, size] as const])));
    dispatch?.(updateCachedMedia(entries));
  };

  const runUpdate = () => {
    pendingUpdate = update()
      .catch(e => console.error("can't update media cache state", e))
      .finally(() => {
        pendingUpdate = undefined;
        if (updateRequested) {
          updateRequested = false;
          runUpdate();
        }
      });
  };

  // a concurrent run would let an older snapshot overwrite freshly cached entries
  const scheduleUpdate = () => {
    if (!pendingUpdate) {
      runUpdate();
    }
  };

  // a new subscriber needs state read after it appeared, not the run already in flight
  const requestUpdate = () => {
    if (pendingUpdate) {
      updateRequested = true;
      return;
    }
    runUpdate();
  };

  mw.startListening({
    actionCreator: startMediaCacheUpdates,
    effect: async (_, api) => {
      dispatch = api.dispatch;
      await getCache();
      if (api.getState().mediaCache.subscribers.length === 0) return;

      if (!intervalId) {
        intervalId = setInterval(scheduleUpdate, updateInterval);
      }
      requestUpdate();
    },
  });

  mw.startListening({
    actionCreator: stopMediaCacheUpdates,
    effect: (_, api) => {
      if (api.getState().mediaCache.subscribers.length !== 0) return;

      clearInterval(intervalId);
      intervalId = undefined;
    },
  });
}

export default addUpdateCacheListeners;
