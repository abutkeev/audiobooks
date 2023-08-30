import { useGetBooksQuery } from '../api/api';
import LoadingWrapper from '../components/common/LoadingWrapper';
import BookCard from '../components/BookCard';
import useAuthors from '../hooks/useAuthors';
import useReaders from '../hooks/useReaders';
import useSeries from '../hooks/useSeries';
import { useMemo } from 'react';

const MainPage: React.FC = () => {
  const { data: books = [], isLoading: booksLoading, isError: booksError } = useGetBooksQuery();
  const { authors, authorsLoading, authorsError } = useAuthors();
  const { readers, readersLoading, readersError } = useReaders();
  const { series, seriesLoading, seriesError } = useSeries();
  const loading = booksLoading || authorsLoading || readersLoading || seriesLoading;
  const error = booksError || authorsError || readersError || seriesError;
  const sortedBooks = useMemo(
    () =>
      books.slice().sort((a, b) => {
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
    [books]
  );

  return (
    <LoadingWrapper loading={loading} error={error}>
      {sortedBooks.map(({ id, info }) => (
        <BookCard key={id} id={id} info={info} authors={authors} readers={readers} series={series} />
      ))}
    </LoadingWrapper>
  );
};

export default MainPage;
