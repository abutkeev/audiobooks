import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { startMediaCacheUpdates, stopMediaCacheUpdates } from '../store/features/media-cache';

const useMediaCache = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(startMediaCacheUpdates());
    return () => {
      dispatch(stopMediaCacheUpdates());
    };
  }, []);
  return useAppSelector(({ mediaCache }) => mediaCache);
};

export default useMediaCache;
