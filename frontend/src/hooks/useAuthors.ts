import { useMemo } from 'react';
import { useAuthorsGetQuery } from '@/api/api';

const useAuthors = () => {
  const { data: authorsArray, isLoading: authorsLoading, isError: authorsError } = useAuthorsGetQuery();
  const authors = useMemo(
    () => (authorsArray ? Object.fromEntries(authorsArray.map(({ id, name }) => [id, name])) : {}),
    [authorsArray]
  );
  return { authors, authorsArray, authorsLoading, authorsError };
};

export default useAuthors;
