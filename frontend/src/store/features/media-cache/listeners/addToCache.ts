import { ListenerMiddlewareInstance } from '@reduxjs/toolkit';
import mediaCacheSlice, { MediaCacheStateSlice, addMediaToCache } from '..';
import axios from 'axios';

function addMediaToCacheListner<State extends MediaCacheStateSlice>(
  mw: ListenerMiddlewareInstance<State>,
  cache: Cache
) {
  const { setCachedMediaProgress, setCachedMediaError } = mediaCacheSlice.actions;
  
  mw.startListening({
    actionCreator: addMediaToCache,
    effect: async ({ payload }, api) => {
      api.cancelActiveListeners();
      for (const url of payload) {
        const cached = await cache.match(url);
        if (cached?.ok && cached.status === 200) {
          api.dispatch(setCachedMediaProgress({ url, progress: 100 }));
          continue;
        }
        const result = axios({
          url,
          signal: api.signal,
          onDownloadProgress: ({ loaded, total }) => {
            api.dispatch(setCachedMediaProgress({ url, progress: total ? (loaded * 100) / total : undefined }));
          },
        })
          .then(() => api.dispatch(setCachedMediaProgress({ url, progress: 100 })))
          .catch(e => {
            console.error(`can't download ${url}`, e);
            api.dispatch(setCachedMediaError(url));
          });
        await api.pause(result);
      }
      const retryUrls = Object.entries(api.getState().mediaCache.entries)
        .filter(([, { state }]) => state === 'error')
        .map(([url]) => url);
      if (retryUrls.length !== 0) {
        await api.delay(1000);
        api.dispatch(addMediaToCache(retryUrls));
      }
    },
  });
}

export default addMediaToCacheListner;
