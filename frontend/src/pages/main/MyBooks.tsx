import { useMemo } from 'react';
import LoadingWrapper from '@/components/common/LoadingWrapper';
import BookCard from '@/components/BookCard';
import useAuthors from '@/hooks/useAuthors';
import useReaders from '@/hooks/useReaders';
import useSeries from '@/hooks/useSeries';
import { Alert } from '@mui/material';
import { BookEntryDto, PositionDto, useBooksGetQuery, usePositionGetQuery } from '@/api/api';
import { useTranslation } from 'react-i18next';
import useSearchMatcher from '@/hooks/useSearchMatcher';

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

  const books = useMemo(
    () =>
      positions.reduce(
        (result, position) => {
          if (position.currentChapter === 0 && position.position === 0) {
            return result;
          }

          const index = result.findIndex(({ book }) => book.id === position.bookId);
          if (index !== -1) {
            if (new Date(result[index].position.updated) < new Date(position.updated)) {
              result[index].position = position;
            }
            return result;
          }
          const book = bookList.find(({ id }) => id === position.bookId);
          if (!book) {
            return result;
          }
          result.push({ book, position });
          return result;
        },
        [] as { book: BookEntryDto; position: PositionDto }[]
      ),
    [positions, bookList]
  );

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

  const sortedBooks = useMemo(
    () => filtredBooks.slice().sort((a, b) => (new Date(a.position.updated) > new Date(b.position.updated) ? -1 : 1)),
    [filtredBooks]
  );

  return (
    <LoadingWrapper loading={loading} error={error}>
      {sortedBooks.length !== 0 ? (
        sortedBooks.map(({ book: { id, info }, position: { updated } }) => (
          <BookCard
            key={id}
            id={id}
            info={info}
            authorsList={authors}
            readersList={readers}
            seriesList={series}
            list
            updated={updated}
          />
        ))
      ) : (
        <Alert severity='info'>{searchMatcher ? t('No books found') : t('No books')}</Alert>
      )}
    </LoadingWrapper>
  );
};

export default MyBooks;
