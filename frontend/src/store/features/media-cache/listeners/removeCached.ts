import { ListenerMiddlewareInstance } from '@reduxjs/toolkit';
import { removeCachedMedia } from '..';
import { GetCache } from '../getListenerMiddleware';

function addRemoveCachedMediaListner<State>(mw: ListenerMiddlewareInstance<State>, getCache: GetCache) {
  mw.startListening({
    actionCreator: removeCachedMedia,
    effect: async ({ payload }) => {
      const cache = await getCache();
      for (const key of payload) {
        cache.delete(key);
      }
    },
  });
}

export default addRemoveCachedMediaListner;
