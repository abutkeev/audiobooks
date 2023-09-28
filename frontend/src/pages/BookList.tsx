import LoadingWrapper from '../components/common/LoadingWrapper';
import BookCard from '../components/BookCard';
import useAuthors from '../hooks/useAuthors';
import useReaders from '../hooks/useReaders';
import useSeries from '../hooks/useSeries';
import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import useSearch from '../hooks/useSearch';
import { Alert } from '@mui/material';
import { currentBookVarName } from './Home';
import useTitle from '../hooks/useTitle';
import { useBooksGetQuery } from '../api/api';

const BookList: React.FC = () => {
  const { data: books = [], isLoading: booksLoading, isError: booksError } = useBooksGetQuery();
  const { authors, authorsLoading, authorsError } = useAuthors();
  const { readers, readersLoading, readersError } = useReaders();
  const { series, seriesLoading, seriesError } = useSeries();
  const loading = booksLoading || authorsLoading || readersLoading || seriesLoading;
  const error = booksError || authorsError || readersError || seriesError;
  const [searchParams] = useSearchParams();
  const { author_id, reader_id, series_id } = Object.fromEntries(searchParams);
  const searchText = useSearch();

  useTitle('Book list');

  useEffect(() => {
    localStorage.removeItem(currentBookVarName);
  }, []);

  const filtredBooks = useMemo(() => {
    let result = books;
    if (author_id) {
      result = result.filter(book => book.info.author_id === author_id);
    }
    if (reader_id) {
      result = result.filter(book => book.info.reader_id === reader_id);
    }
    if (series_id) {
      result = result.filter(book => book.info.series_id === series_id);
    }
    if (searchText) {
      const searchTextLower = searchText.toLowerCase();
      const filtredAuhorsIds = Object.entries(authors)
        .filter(([, name]) => name.toLowerCase().includes(searchTextLower))
        .map(([id]) => id);
      const filtredReadersIds = Object.entries(readers)
        .filter(([, name]) => name.toLowerCase().includes(searchTextLower))
        .map(([id]) => id);
      const filtredSeriesIds = Object.entries(series)
        .filter(([, name]) => name.toLowerCase().includes(searchTextLower))
        .map(([id]) => id);
      result = result.filter(
        ({ info: { name, author_id, reader_id, series_id } }) =>
          name.toLowerCase().includes(searchTextLower) ||
          filtredAuhorsIds.includes(author_id) ||
          filtredReadersIds.includes(reader_id) ||
          (series_id && filtredSeriesIds.includes(series_id))
      );
    }
    return result;
  }, [author_id, reader_id, series_id, searchText, books]);

  const sortedBooks = useMemo(
    () =>
      filtredBooks.slice().sort((a, b) => {
        if (a.info.author_id > b.info.author_id) {
          return 1;
        }
        if (a.info.author_id === b.info.author_id && a.info.series_id && a.info.series_id === b.info.series_id) {
          if (a.info.series_number && b.info.series_number && a.info.series_number > b.info.series_number) {
            return 1;
          }
        }
        return -1;
      }),
    [filtredBooks]
  );

  return (
    <LoadingWrapper loading={loading} error={error}>
      {sortedBooks.length !== 0 ? (
        sortedBooks.map(({ id, info }) => (
          <BookCard key={id} id={id} info={info} authors={authors} readers={readers} series={series} />
        ))
      ) : (
        <Alert severity='info'>
          {author_id || reader_id || series_id || searchText ? 'No books found' : 'No books'}
        </Alert>
      )}
    </LoadingWrapper>
  );
};

export default BookList;
