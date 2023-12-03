import LoadingWrapper from '@/components/common/LoadingWrapper';
import BookCard from '@/components/BookCard';
import useAuthors from '@/hooks/useAuthors';
import useReaders from '@/hooks/useReaders';
import useSeries from '@/hooks/useSeries';
import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import useSearch from '@/hooks/useSearch';
import { Alert } from '@mui/material';
import { currentBookVarName } from './Home';
import useTitle from '@/hooks/useTitle';
import { useBooksGetQuery } from '@/api/api';
import { useTranslation } from 'react-i18next';

const BookList: React.FC = () => {
  const { t } = useTranslation();
  const { data: books = [], isLoading: booksLoading, isError: booksError } = useBooksGetQuery();
  const { authors, authorsLoading, authorsError } = useAuthors();
  const { readers, readersLoading, readersError } = useReaders();
  const { series, seriesLoading, seriesError } = useSeries();
  const loading = booksLoading || authorsLoading || readersLoading || seriesLoading;
  const error = booksError || authorsError || readersError || seriesError;
  const [searchParams] = useSearchParams();
  const { author_id, reader_id, series_id } = Object.fromEntries(searchParams);
  const searchText = useSearch();

  useTitle(t('Book list'));

  useEffect(() => {
    localStorage.removeItem(currentBookVarName);
  }, []);

  const filtredBooks = useMemo(() => {
    let result = books;
    if (author_id) {
      result = result.filter(book => book.info.authors.includes(author_id));
    }
    if (reader_id) {
      result = result.filter(book => book.info.readers.includes(reader_id));
    }
    if (series_id) {
      result = result.filter(book => book.info.series.some(({ id }) => id === series_id));
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
        ({ info: { name, authors, readers, series } }) =>
          name.toLowerCase().includes(searchTextLower) ||
          filtredAuhorsIds.some(author_id => authors.includes(author_id)) ||
          filtredReadersIds.some(reader_id => readers.includes(reader_id)) ||
          filtredSeriesIds.some(series_id => series.some(({ id }) => id === series_id))
      );
    }
    return result;
  }, [author_id, reader_id, series_id, searchText, books, authors, readers, series]);

  const sortedBooks = useMemo(
    () =>
      filtredBooks.slice().sort((a, b) => {
        if (a.info.authors[0] > b.info.authors[0]) {
          return 1;
        }
        if (
          a.info.authors[0] === b.info.authors[0] &&
          a.info.series.length !== 0 &&
          a.info.series[0].id === b.info.series[0]?.id
        ) {
          if (
            a.info.series[0].number &&
            b.info.series[0]?.number &&
            a.info.series[0].number > b.info.series[0].number
          ) {
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
          <BookCard key={id} id={id} info={info} authorsList={authors} readersList={readers} seriesList={series} list />
        ))
      ) : (
        <Alert severity='info'>
          {author_id || reader_id || series_id || searchText ? t('No books found') : t('No books')}
        </Alert>
      )}
    </LoadingWrapper>
  );
};

export default BookList;
