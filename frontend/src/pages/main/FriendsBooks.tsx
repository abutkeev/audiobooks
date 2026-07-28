import { useMemo } from 'react';
import LoadingWrapper from '@/components/common/LoadingWrapper';
import BookPositionList from '@/components/BookPositionList';
import useAuthors from '@/hooks/useAuthors';
import useReaders from '@/hooks/useReaders';
import useSeries from '@/hooks/useSeries';
import { Alert, Typography } from '@mui/material';
import { useBooksGetQuery, usePositionGetFriendsQuery } from '@/api/api';
import { useTranslation } from 'react-i18next';
import CustomAccordion from '@/components/common/CustomAccordion';
import UserOnlineIndicator from '@/components/UserOnlineIndicator';
import getBooksWithPositions from '@/utils/getBooksWithPositions';

const FriendsBooks: React.FC = () => {
  const { t } = useTranslation();
  const { data: bookList = [], isLoading: booksLoading, isError: booksError } = useBooksGetQuery();
  const { data: positions = [], isLoading: positionsLoading, isError: positionsError } = usePositionGetFriendsQuery();
  const { authors, authorsLoading, authorsError } = useAuthors();
  const { readers, readersLoading, readersError } = useReaders();
  const { series, seriesLoading, seriesError } = useSeries();
  const loading = booksLoading || authorsLoading || readersLoading || seriesLoading || positionsLoading;
  const error = booksError || authorsError || readersError || seriesError || positionsError;

  const friendsBooks = useMemo(
    () => positions.map(({ friend, positions }) => ({ friend, books: getBooksWithPositions(positions, bookList) })),
    [positions, bookList]
  );

  return (
    <LoadingWrapper loading={loading} error={error}>
      {friendsBooks.length !== 0 ? (
        friendsBooks.map(({ friend, books }) => (
          <CustomAccordion
            key={friend.uid}
            summary={
              <Typography>
                <UserOnlineIndicator online={friend.online} /> {`${friend.name} (${friend.login})`}
              </Typography>
            }
            details={<BookPositionList books={books} authorsList={authors} readersList={readers} seriesList={series} />}
          />
        ))
      ) : (
        <Alert severity='info'>{t('No books')}</Alert>
      )}
    </LoadingWrapper>
  );
};

export default FriendsBooks;
