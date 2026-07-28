import { useMemo } from 'react';
import LoadingWrapper from '@/components/common/LoadingWrapper';
import BookPositionList from '@/components/BookPositionList';
import useAuthors from '@/hooks/useAuthors';
import useReaders from '@/hooks/useReaders';
import useSeries from '@/hooks/useSeries';
import { Alert } from '@mui/material';
import { useBooksGetQuery, usePositionGetQuery } from '@/api/api';
import { useTranslation } from 'react-i18next';
import useSearchMatcher from '@/hooks/useSearchMatcher';
import getBooksWithPositions from '@/utils/getBooksWithPositions';

const MyBooks: React.FC = () => {
  const { t } = useTranslation();
  const { data: bookList = [], isLoading: booksLoading, isError: booksError } = useBooksGetQuery();
  const { data: positions = [], isLoading: positionsLoading, isError: positionsError } = usePositionGetQuery();
  const { authors, authorsLoading, authorsError } = useAuthors();
  const { readers, readersLoading, readersError } = useReaders();
  const { series, seriesLoading, seriesError } = useSeries();
  const loading = booksLoading || authorsLoading || readersLoading || seriesLoading || positionsLoading;
  const error = booksError || authorsError || readersError || seriesError || positionsError;
  const searchMatcher = useSearchMatcher();

  const books = useMemo(() => getBooksWithPositions(positions, bookList), [positions, bookList]);

  const filtredBooks = useMemo(() => {
    if (!searchMatcher) return books;
    const filtredAuhorsIds = Object.entries(authors)
      .filter(([, name]) => searchMatcher(name))
      .map(([id]) => id);
    const filtredReadersIds = Object.entries(readers)
      .filter(([, name]) => searchMatcher(name))
      .map(([id]) => id);
    const filtredSeriesIds = Object.entries(series)
      .filter(([, name]) => searchMatcher(name))
      .map(([id]) => id);
    const result = books.filter(
      ({
        book: {
          info: { name, authors, readers, series },
        },
      }) =>
        searchMatcher(name) ||
        filtredAuhorsIds.some(author_id => authors.includes(author_id)) ||
        filtredReadersIds.some(reader_id => readers.includes(reader_id)) ||
        filtredSeriesIds.some(series_id => series.some(({ id }) => id === series_id))
    );
    return result;
  }, [searchMatcher, books, authors, readers, series]);

  return (
    <LoadingWrapper loading={loading} error={error}>
      {filtredBooks.length !== 0 ? (
        <BookPositionList books={filtredBooks} authorsList={authors} readersList={readers} seriesList={series} />
      ) : (
        <Alert severity='info'>{searchMatcher ? t('No books found') : t('No books')}</Alert>
      )}
    </LoadingWrapper>
  );
};

export default MyBooks;
