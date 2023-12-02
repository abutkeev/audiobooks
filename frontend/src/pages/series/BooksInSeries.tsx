import { FC } from 'react';
import { BookEntryDto } from '@/api/api';
import BookCard from '@/components/BookCard';
import CustomAccordion from '@/components/common/CustomAccordion';
import useAuthors from '@/hooks/useAuthors';
import useReaders from '@/hooks/useReaders';
import useSeries from '@/hooks/useSeries';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface BooksInSeriesProps {
  books: BookEntryDto[];
}

const BooksInSeries: FC<BooksInSeriesProps> = ({ books }) => {
  const { authors } = useAuthors();
  const { readers } = useReaders();
  const { series } = useSeries();
  const { t } = useTranslation();

  if (books.length === 0) return null;

  return (
    <CustomAccordion
      summary={<Typography>{t('{{count}} books', { count: books.length })}</Typography>}
      details={
        <>
          {books.map(({ id, info }) => (
            <BookCard
              key={id}
              list
              id={id}
              info={info}
              authorsList={authors}
              readersList={readers}
              seriesList={series}
            />
          ))}
        </>
      }
    />
  );
};

export default BooksInSeries;
