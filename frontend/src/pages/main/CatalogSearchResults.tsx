import { FC, useMemo } from 'react';
import { Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useBooksGetQuery } from '@/api/api';
import BookCard from '@/components/BookCard';
import useAuthors from '@/hooks/useAuthors';
import useBookSearchFilter from '@/hooks/useBookSearchFilter';
import useReaders from '@/hooks/useReaders';
import useSeries from '@/hooks/useSeries';

interface CatalogSearchResultsProps {
  shownBookIds: string[];
}

const CatalogSearchResults: FC<CatalogSearchResultsProps> = ({ shownBookIds }) => {
  const { t } = useTranslation();
  const { data: books = [] } = useBooksGetQuery();
  const { authors } = useAuthors();
  const { readers } = useReaders();
  const { series } = useSeries();
  const matchesSearch = useBookSearchFilter();

  const found = useMemo(() => {
    if (!matchesSearch) return [];

    return books
      .filter(({ id, info }) => !shownBookIds.includes(id) && matchesSearch(info))
      .sort(({ info: a }, { info: b }) => a.name.localeCompare(b.name));
  }, [books, shownBookIds, matchesSearch]);

  if (found.length === 0) return null;

  return (
    <>
      <Divider sx={{ my: 2 }} />
      <Typography variant='subtitle2' sx={{ mb: 1, color: 'text.secondary' }}>
        {t('Found in all books')}
      </Typography>
      {found.map(({ id, info }) => (
        <BookCard key={id} id={id} info={info} authorsList={authors} readersList={readers} seriesList={series} list />
      ))}
    </>
  );
};

export default CatalogSearchResults;
