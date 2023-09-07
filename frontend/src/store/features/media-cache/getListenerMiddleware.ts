import { ListenerMiddlewareInstance, createListenerMiddleware } from '@reduxjs/toolkit';
import addUpdateCacheListeners from './listeners/updateCached';
import addRemoveCachedMediaListner from './listeners/removeCached';
import addMediaToCacheListner from './listeners/addToCache';
import { MediaCacheStateSlice } from '.';

function setupListeners<State extends MediaCacheStateSlice>(mw: ListenerMiddlewareInstance<State>, cache: Cache) {
  addUpdateCacheListeners(mw, cache);
  addMediaToCacheListner(mw, cache);
  addRemoveCachedMediaListner(mw, cache);
}

function setup<State extends MediaCacheStateSlice>(mw: ListenerMiddlewareInstance<State>, cacheName: string) {
  caches.open(cacheName).then(cache => setupListeners(mw, cache));
}

function createMediaCacheListenerMiddleware<State extends MediaCacheStateSlice>(cacheName: string) {
  const mw = createListenerMiddleware<State>();
  if ('caches' in window && 'serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      if (registrations.length !== 0) {
        setup(mw, cacheName);
        return;
      }
      navigator.serviceWorker.oncontrollerchange = () => {
        setup(mw, cacheName);
      };
    });
  }

  return mw.middleware;
}

export default createMediaCacheListenerMiddleware;
