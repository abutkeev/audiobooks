import { useMemo } from 'react';
import { useGetReadersQuery } from '../api/api';

const useReaders = () => {
  const { data: readersArray, isLoading: readersLoading, isError: readersError } = useGetReadersQuery();
  const readers = useMemo(
    () => (readersArray ? Object.fromEntries(readersArray.map(({ id, name }) => [id, name])) : {}),
    [readersArray]
  );
  return { readers, readersArray, readersError, readersLoading };
};

export default useReaders;
