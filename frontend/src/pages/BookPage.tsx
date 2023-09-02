import { useParams } from 'react-router-dom';
import { useGetBookQuery } from '../api/api';
import BookCard from '../components/BookCard';
import LoadingWrapper from '../components/common/LoadingWrapper';
import useAuthors from '../hooks/useAuthors';
import useReaders from '../hooks/useReaders';
import useSeries from '../hooks/useSeries';
import Player from '../components/player';
import { useEffect } from 'react';
import { currentBookVarName } from './Home';
import useTitle from '../hooks/useTitle';

const BookPage: React.FC = () => {
  const { id = '' } = useParams();
  const { data, isLoading, isError } = useGetBookQuery({ id });
  const { authors, authorsLoading, authorsError } = useAuthors();
  const { readers, readersLoading, readersError } = useReaders();
  const { series, seriesLoading, seriesError } = useSeries();

  useTitle(data?.info.name || '');

  useEffect(() => {
    localStorage.setItem(currentBookVarName, id);
  }, [id]);

  const loading = isLoading || authorsLoading || readersLoading || seriesLoading;
  const error = isError || authorsError || readersError || seriesError;

  return (
    <LoadingWrapper loading={loading} error={error}>
      {data && (
        <>
          <BookCard info={data.info} authors={authors} readers={readers} series={series} />
          <Player
            info={{
              name: data.info.name,
              author: authors[data.info.author_id],
              series: data.info.series_id && series[data.info.series_id],
              cover: data.info.cover,
            }}
            bookId={id}
            chapters={data.chapters}
          />
        </>
      )}
    </LoadingWrapper>
  );
};

export default BookPage;
