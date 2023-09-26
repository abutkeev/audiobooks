import { useMemo } from 'react';
import { useReadersGetQuery } from '../api/api';

const useReaders = () => {
  const { data: readersArray, isLoading: readersLoading, isError: readersError } = useReadersGetQuery();
  const readers = useMemo(
    () => (readersArray ? Object.fromEntries(readersArray.map(({ id, name }) => [id, name])) : {}),
    [readersArray]
  );
  return { readers, readersArray, readersError, readersLoading };
};

export default useReaders;
