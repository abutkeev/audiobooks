import { useEffect } from 'react';
import { useAppDispatch } from '@/store';
import { setTitle } from '@/store/features/title';

const useTitle = (title: string) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setTitle(title));

    return () => void dispatch(setTitle(''));
  }, [title, dispatch]);
};

export default useTitle;
