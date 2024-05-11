import { useMemo } from 'react';
import LoadingWrapper from '@/components/common/LoadingWrapper';
import BookCard from '@/components/BookCard';
import useAuthors from '@/hooks/useAuthors';
import useReaders from '@/hooks/useReaders';
import useSeries from '@/hooks/useSeries';
import { Alert, Typography } from '@mui/material';
import { BookEntryDto, PositionDto, useBooksGetQuery, usePositionGetFriendsQuery } from '@/api/api';
import { useTranslation } from 'react-i18next';
import CustomAccordion from '@/components/common/CustomAccordion';
import UserOnlineIndicator from '@/components/UserOnlineIndicator';

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
    () =>
      positions.map(({ friend, positions }) => {
        return {
          friend,
          positions: positions
            .reduce((result: { position: PositionDto; book: BookEntryDto }[], position) => {
              const index = result.findIndex(({ position: { bookId } }) => bookId === position.bookId);
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

              result.push({ position, book });
              return result;
            }, [])
            .sort((a, b) => new Date(b.position.updated).getTime() - new Date(a.position.updated).getTime()),
        };
      }),
    [positions, bookList]
  );

  return (
    <LoadingWrapper loading={loading} error={error}>
      {friendsBooks.length !== 0 ? (
        friendsBooks.map(({ friend, positions }) => (
          <CustomAccordion
            key={friend.uid}
            summary={
              <Typography>
                <UserOnlineIndicator online={friend.online} /> {`${friend.name} (${friend.login})`}
              </Typography>
            }
            details={positions.map(({ book: { id, info }, position: { updated } }) => (
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
            ))}
          />
        ))
      ) : (
        <Alert severity='info'>{t('No books')}</Alert>
      )}
    </LoadingWrapper>
  );
};

export default FriendsBooks;
