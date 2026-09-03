import { useEffect, useId } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { startMediaCacheUpdates, stopMediaCacheUpdates } from '@/store/features/media-cache';

const useMediaCache = () => {
  const dispatch = useAppDispatch();
  const id = useId();
  useEffect(() => {
    dispatch(startMediaCacheUpdates(id));
    return () => {
      dispatch(stopMediaCacheUpdates(id));
    };
  }, [dispatch, id]);
  return useAppSelector(({ mediaCache }) => mediaCache);
};

export default useMediaCache;
