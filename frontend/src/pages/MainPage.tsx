import { useGetBooksQuery } from '../api/api';
import LoadingWrapper from '../components/common/LoadingWrapper';
import BookCard from '../components/BookCard';
import useAuthors from '../hooks/useAuthors';
import useReaders from '../hooks/useReaders';
import useSeries from '../hooks/useSeries';

const MainPage: React.FC = () => {
  const { data: books = [], isLoading: booksLoading, isError: booksError } = useGetBooksQuery();
  const { authors, authorsLoading, authorsError } = useAuthors();
  const { readers, readersLoading, readersError } = useReaders();
  const { series, seriesLoading, seriesError } = useSeries();
  const loading = booksLoading || authorsLoading || readersLoading || seriesLoading;
  const error = booksError || authorsError || readersError || seriesError;

  return (
    <LoadingWrapper loading={loading} error={error}>
      {books.map(({ id, info }) => (
        <BookCard key={id} id={id} info={info} authors={authors} readers={readers} series={series} />
      ))}
    </LoadingWrapper>
  );
};

export default MainPage;
