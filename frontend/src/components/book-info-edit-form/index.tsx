import { BookInfoDto, useAuthorsGetQuery, useReadersGetQuery, useSeriesGetQuery } from '@/api/api';
import { Stack, TextField } from '@mui/material';
import ErrorWrapper from '@/components/common/ErrorWrapper';
import { useTranslation } from 'react-i18next';
import MultiSelect from '@/components/common/MultiSelect';
import SeriesEditForm from './SeriesEditForm';

interface BookInfoEditFormProps {
  name: string;
  setName(v: string): void;
  authors: string[];
  setAuthors(v: string[]): void;
  readers: string[];
  setReaders(v: string[]): void;
  series: BookInfoDto['series'];
  setSeries(v: BookInfoDto['series']): void;
}

const BookInfoEditForm: React.FC<BookInfoEditFormProps> = ({
  name,
  setName,
  authors,
  setAuthors,
  readers,
  setReaders,
  series,
  setSeries,
}) => {
  const { t } = useTranslation();
  const { data: authorsList = [], isLoading: authorsLoading, isError: authorsError } = useAuthorsGetQuery();
  const { data: readersList = [], isLoading: readersLoading, isError: readersError } = useReadersGetQuery();
  const { isError: seriesError } = useSeriesGetQuery();

  const error = authorsError || readersError || seriesError;

  return (
    <ErrorWrapper error={error}>
      <Stack spacing={2} pt={1}>
        <TextField
          fullWidth
          required
          label={t('Name.book', 'Name')}
          value={name}
          onChange={({ target: { value } }) => setName(value)}
          onKeyDown={e => e.stopPropagation()}
          error={!name}
        />
        <MultiSelect
          list={authorsList}
          label={t('Author')}
          values={authors}
          onChange={setAuthors}
          loading={authorsLoading}
          required
          selectOptionsText={t('Select authors')}
          noOptionsText={t('No authors')}
        />
        <MultiSelect
          list={readersList}
          label={t('Reader')}
          values={readers}
          onChange={setReaders}
          loading={readersLoading}
          required
          selectOptionsText={t('Select readers')}
          noOptionsText={t('No readers')}
        />
        <SeriesEditForm series={series} setSeries={setSeries} />
      </Stack>
    </ErrorWrapper>
  );
};

export default BookInfoEditForm;
