import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { showSearch } from '../store/features/search';

const useSearch = () => {
  const text = useAppSelector(({ search: { text } }) => text);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(showSearch(true));
    return () => {
      dispatch(showSearch(false));
    };
  }, []);

  return text;
};

export default useSearch;
