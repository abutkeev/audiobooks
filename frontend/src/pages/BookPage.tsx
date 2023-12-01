import { useParams, useSearchParams } from 'react-router-dom';
import BookCard from '@/components/BookCard';
import LoadingWrapper from '@/components/common/LoadingWrapper';
import useAuthors from '@/hooks/useAuthors';
import useReaders from '@/hooks/useReaders';
import useSeries from '@/hooks/useSeries';
import Player from '@/components/player';
import { useEffect, useMemo } from 'react';
import { currentBookVarName } from './Home';
import useTitle from '@/hooks/useTitle';
import OtherPlayersPosition from '@/components/OtherPlayersPosition';
import { useBooksGetBookInfoQuery } from '@/api/api';

const BookPage: React.FC = () => {
  const { id = '' } = useParams();
  const { data, isLoading, isError } = useBooksGetBookInfoQuery({ id });
  const { authors, authorsLoading, authorsError } = useAuthors();
  const { readers, readersLoading, readersError } = useReaders();
  const { series, seriesLoading, seriesError } = useSeries();

  useTitle(data?.info.name || '');

  useEffect(() => {
    localStorage.setItem(currentBookVarName, id);
  }, [id]);

  const [searchParams, setSearchParams] = useSearchParams();
  const externalState = useMemo(() => {
    const params = Object.fromEntries(searchParams);
    const position = +params.position;
    const currentChapter = +params.currentChapter;
    if (!isFinite(position) || !isFinite(currentChapter) || position < 0 || currentChapter < 0) return undefined;
    return { position, currentChapter };
  }, [searchParams]);

  const loading = isLoading || authorsLoading || readersLoading || seriesLoading;
  const error = isError || authorsError || readersError || seriesError;

  const resetSearchParams = () => {
    setSearchParams([]);
  };

  return (
    <LoadingWrapper loading={loading} error={error}>
      {data && (
        <>
          <BookCard id={id} info={data.info} authorsList={authors} readersList={readers} seriesList={series} />
          {data.chapters.length !== 0 && (
            <Player
              bookInfo={{
                name: data.info.name,
                author: data.info.authors.map(author_id => authors[author_id]).join(','),
                series:
                  data.info.series.length !== 0 ? data.info.series.map(({ id }) => series[id]).join(',') : undefined,
                cover: data.info.cover,
              }}
              bookId={id}
              chapters={data.chapters}
              externalState={externalState}
              onExternalStateApply={resetSearchParams}
            />
          )}
          <OtherPlayersPosition bookId={id} chapters={data.chapters} />
        </>
      )}
    </LoadingWrapper>
  );
};

export default BookPage;
