import { ListenerMiddlewareInstance, createListenerMiddleware } from '@reduxjs/toolkit';
import addUpdateCacheListeners from './listeners/updateCached';
import addRemoveCachedMediaListner from './listeners/removeCached';
import addMediaToCacheListner from './listeners/addToCache';
import type { MediaCacheStateSlice } from '.';
import mediaCacheSupported from './mediaCacheSupported';

export type GetCache = () => Promise<Cache>;

function setupListeners<State extends MediaCacheStateSlice>(mw: ListenerMiddlewareInstance<State>, getCache: GetCache) {
  addUpdateCacheListeners(mw, getCache);
  addMediaToCacheListner(mw, getCache);
  addRemoveCachedMediaListner(mw, getCache);
}

const waitForServiceWorker = async () => {
  const registrations = await navigator.serviceWorker.getRegistrations();
  if (registrations.length !== 0) return;

  await new Promise(resolve => {
    navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true });
  });
};

function createMediaCacheListenerMiddleware<State extends MediaCacheStateSlice>(cacheName: string) {
  const mw = createListenerMiddleware<State>();
  if (mediaCacheSupported) {
    // registering listeners later would lose actions dispatched before the cache is ready
    const cache = waitForServiceWorker().then(() => caches.open(cacheName));
    setupListeners(mw, () => cache);
  }

  return mw.middleware;
}

export default createMediaCacheListenerMiddleware;
