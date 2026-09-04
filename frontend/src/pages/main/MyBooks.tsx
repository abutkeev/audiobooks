import { useMemo } from 'react';
import LoadingWrapper from '@/components/common/LoadingWrapper';
import BookPositionList from '@/components/BookPositionList';
import useAuthors from '@/hooks/useAuthors';
import useReaders from '@/hooks/useReaders';
import useSeries from '@/hooks/useSeries';
import { Alert } from '@mui/material';
import { useBooksGetQuery, usePositionGetQuery } from '@/api/api';
import { useTranslation } from 'react-i18next';
import useBookSearchFilter from '@/hooks/useBookSearchFilter';
import getBooksWithPositions from '@/utils/getBooksWithPositions';
import CatalogSearchResults from './CatalogSearchResults';

const MyBooks: React.FC = () => {
  const { t } = useTranslation();
  const { data: bookList = [], isLoading: booksLoading, isError: booksError } = useBooksGetQuery();
  const { data: positions = [], isLoading: positionsLoading, isError: positionsError } = usePositionGetQuery();
  const { authors, authorsLoading, authorsError } = useAuthors();
  const { readers, readersLoading, readersError } = useReaders();
  const { series, seriesLoading, seriesError } = useSeries();
  const loading = booksLoading || authorsLoading || readersLoading || seriesLoading || positionsLoading;
  const error = booksError || authorsError || readersError || seriesError || positionsError;
  const matchesSearch = useBookSearchFilter();

  const books = useMemo(() => getBooksWithPositions(positions, bookList), [positions, bookList]);

  const filtredBooks = useMemo(
    () => (matchesSearch ? books.filter(({ book: { info } }) => matchesSearch(info)) : books),
    [matchesSearch, books]
  );

  const shownBookIds = useMemo(() => books.map(({ book: { id } }) => id), [books]);

  return (
    <>
      <LoadingWrapper loading={loading} error={error}>
        {filtredBooks.length !== 0 ? (
          <BookPositionList books={filtredBooks} authorsList={authors} readersList={readers} seriesList={series} />
        ) : (
          <Alert severity='info'>{matchesSearch ? t('No matches among my current books') : t('No books')}</Alert>
        )}
      </LoadingWrapper>
      {/* outside LoadingWrapper: it unmounts children while loading, and useSearch clears the search on unmount */}
      <CatalogSearchResults shownBookIds={shownBookIds} />
    </>
  );
};

export default MyBooks;
