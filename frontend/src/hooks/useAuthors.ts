import { useMemo } from 'react';
import { useGetAuthorsQuery } from '../api/api';

const useAuthors = () => {
  const { data: authorsArray, isLoading: authorsLoading, isError: authorsError } = useGetAuthorsQuery();
  const authors = useMemo(
    () => (authorsArray ? Object.fromEntries(authorsArray.map(({ id, name }) => [id, name])) : {}),
    [authorsArray]
  );
  return { authors, authorsArray, authorsLoading, authorsError };
};

export default useAuthors;
