import { ListenerMiddlewareInstance } from '@reduxjs/toolkit';
import mediaCacheSlice, { MediaCacheStateSlice, addMediaToCache } from '..';
import axios from 'axios';
import parseContentLength from '../parseContentLength';
import { GetCache } from '../getListenerMiddleware';

const maxAttempts = 3;
const retryDelay = 1000;

const isPermanentError = (e: unknown) => {
  const status = axios.isAxiosError(e) ? e.response?.status : undefined;
  return !!status && status >= 400 && status < 500;
};

function addMediaToCacheListner<State extends MediaCacheStateSlice>(
  mw: ListenerMiddlewareInstance<State>,
  getCache: GetCache
) {
  const { setCachedMediaProgress, setCachedMediaError, clearCachedMediaProgress } = mediaCacheSlice.actions;
  const attempts = new Map<string, number>();

  mw.startListening({
    actionCreator: addMediaToCache,
    effect: async ({ payload }, api) => {
      api.cancelActiveListeners();
      const cache = await getCache();
      const failed: string[] = [];

      for (const url of payload) {
        const cached = await cache.match(url);
        if (cached?.ok && cached.status === 200) {
          attempts.delete(url);
          api.dispatch(
            setCachedMediaProgress({
              url,
              progress: 100,
              size: parseContentLength(cached.headers.get('content-length')),
            })
          );
          continue;
        }
        const result = axios({
          url,
          signal: api.signal,
          onDownloadProgress: ({ loaded, total }) => {
            api.dispatch(setCachedMediaProgress({ url, progress: total ? (loaded * 100) / total : undefined }));
          },
        })
          .then(({ headers }) => {
            attempts.delete(url);
            api.dispatch(
              setCachedMediaProgress({
                url,
                progress: 100,
                size: parseContentLength(String(headers['content-length'] ?? '')),
              })
            );
          })
          .catch(e => {
            // cancelled by a download of another book, not a failure of this one
            if (axios.isCancel(e)) {
              api.dispatch(clearCachedMediaProgress(url));
              return;
            }

            console.error(`can't download ${url}`, e);
            api.dispatch(setCachedMediaError(url));
            const attempt = (attempts.get(url) || 0) + 1;
            attempts.set(url, attempt);
            if (attempt < maxAttempts && !isPermanentError(e)) {
              failed.push(url);
            }
          });
        await api.pause(result);
      }

      // only urls of this request are retried: a stale error must not restart on its own
      if (failed.length !== 0) {
        await api.delay(retryDelay * (attempts.get(failed[0]) || 1));
        api.dispatch(addMediaToCache(failed));
      }
    },
  });
}

export default addMediaToCacheListner;
