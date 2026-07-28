import { FC, useMemo } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Alert, Typography } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useBooksGetQuery, usePositionGetUsersQuery } from '@/api/api';
import BookPositionList from '@/components/BookPositionList';
import LoadingWrapper from '@/components/common/LoadingWrapper';
import useAuthors from '@/hooks/useAuthors';
import useReaders from '@/hooks/useReaders';
import useSeries from '@/hooks/useSeries';
import getBooksWithPositions from '@/utils/getBooksWithPositions';

interface UserBooksProps {
  userId: string;
}

const UserBooks: FC<UserBooksProps> = ({ userId }) => {
  const { t } = useTranslation();
  const { data: bookList = [], isLoading: booksLoading, isError: booksError } = useBooksGetQuery();
  const { data: positions = [], isLoading: positionsLoading, isError: positionsError } = usePositionGetUsersQuery();
  const { authors, authorsLoading, authorsError } = useAuthors();
  const { readers, readersLoading, readersError } = useReaders();
  const { series, seriesLoading, seriesError } = useSeries();
  const loading = booksLoading || authorsLoading || readersLoading || seriesLoading || positionsLoading;
  const error = booksError || authorsError || readersError || seriesError || positionsError;

  const books = useMemo(() => {
    const { positions: userPositions = [] } = positions.find(({ userId: id }) => id === userId) || {};
    return getBooksWithPositions(userPositions, bookList);
  }, [positions, bookList, userId]);

  return (
    <Accordion square slotProps={{ transition: { unmountOnExit: true } }}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>{t('Current books ({{total}})', { total: books.length })}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        <LoadingWrapper loading={loading} error={error}>
          {books.length !== 0 ? (
            <BookPositionList
              books={books}
              userId={userId}
              authorsList={authors}
              readersList={readers}
              seriesList={series}
            />
          ) : (
            <Alert severity='info'>{t('No books')}</Alert>
          )}
        </LoadingWrapper>
      </AccordionDetails>
    </Accordion>
  );
};

export default UserBooks;
