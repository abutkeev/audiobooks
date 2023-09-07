import { ListenerMiddlewareInstance } from '@reduxjs/toolkit';
import { removeCachedMedia } from '..';

function addRemoveCachedMediaListner<State>(mw: ListenerMiddlewareInstance<State>, cache: Cache) {
  mw.startListening({
    actionCreator: removeCachedMedia,
    effect: ({ payload }) => {
      for (const key of payload) {
        cache.delete(key);
      }
    },
  });
}

export default addRemoveCachedMediaListner;
