import { useMemo } from 'react';
import { BookInfoDto } from '@/api/api';
import useAuthors from './useAuthors';
import useReaders from './useReaders';
import useSearchMatcher from './useSearchMatcher';
import useSeries from './useSeries';

const useBookSearchFilter = () => {
  const searchMatcher = useSearchMatcher();
  const { authors } = useAuthors();
  const { readers } = useReaders();
  const { series } = useSeries();

  return useMemo(() => {
    if (!searchMatcher) return undefined;

    const matchedIds = (names: Record<string, string>) =>
      Object.entries(names)
        .filter(([, name]) => searchMatcher(name))
        .map(([id]) => id);

    const matchedAuthors = matchedIds(authors);
    const matchedReaders = matchedIds(readers);
    const matchedSeries = matchedIds(series);

    return ({ name, authors: bookAuthors, readers: bookReaders, series: bookSeries }: BookInfoDto) =>
      searchMatcher(name) ||
      matchedAuthors.some(id => bookAuthors.includes(id)) ||
      matchedReaders.some(id => bookReaders.includes(id)) ||
      matchedSeries.some(id => bookSeries.some(({ id: bookSeriesId }) => bookSeriesId === id));
  }, [searchMatcher, authors, readers, series]);
};

export default useBookSearchFilter;
