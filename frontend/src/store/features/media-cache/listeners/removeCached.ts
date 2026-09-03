import { ListenerMiddlewareInstance } from '@reduxjs/toolkit';
import { removeCachedMedia } from '..';
import { GetCache } from '../getListenerMiddleware';

function addRemoveCachedMediaListner<State>(mw: ListenerMiddlewareInstance<State>, getCache: GetCache) {
  mw.startListening({
    actionCreator: removeCachedMedia,
    effect: async ({ payload }) => {
      const cache = await getCache();
      const results = await Promise.allSettled(payload.map(key => cache.delete(key)));
      for (const result of results) {
        if (result.status === 'rejected') {
          console.error("can't remove cached media", result.reason);
        }
      }
    },
  });
}

export default addRemoveCachedMediaListner;
