import { ListenerMiddlewareInstance } from '@reduxjs/toolkit';
import mediaCacheSlice, { startMediaCacheUpdates, stopMediaCacheUpdates } from '..';

const updateInterval = 1 * 60 * 1000;

function addUpdateCacheListeners<State>(mw: ListenerMiddlewareInstance<State>, cache: Cache) {
  let intervalId: ReturnType<typeof setInterval>;

  mw.startListening({
    actionCreator: startMediaCacheUpdates,
    effect: (_, api) => {
      api.cancelActiveListeners();

      const { updateCachedMedia } = mediaCacheSlice.actions;

      const update = async () => {
        const cachedUrls = (await cache.keys()).filter(({ method }) => method === 'GET').map(({ url }) => url);
        api.dispatch(updateCachedMedia(cachedUrls));
      };
      update();
      intervalId = setInterval(update, updateInterval);
    },
  });

  mw.startListening({
    actionCreator: stopMediaCacheUpdates,
    effect: () => clearInterval(intervalId),
  });
}

export default addUpdateCacheListeners;
