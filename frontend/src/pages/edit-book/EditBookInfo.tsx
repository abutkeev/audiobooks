import {
  BookInfoDto,
  ChapterDto,
  useAuthorsGetQuery,
  useBooksEditMutation,
  useReadersGetQuery,
  useSeriesGetQuery,
} from '@/api/api';
import { Button, Stack, TextField, TextFieldProps } from '@mui/material';
import ErrorWrapper from '@/components/common/ErrorWrapper';
import { addSnackbar } from '@/store/features/snackbars';
import { useAppDispatch } from '@/store';
import { useTranslation } from 'react-i18next';
import useUpdatingState from '@/hooks/useUpdatingState';
import MultiSelect from '@/components/common/MultiSelect';

interface EditBookInfoProps {
  id: string;
  info: BookInfoDto;
  chapters: ChapterDto[];
}

const EditBookInfo: React.FC<EditBookInfoProps> = ({ id, info, chapters }) => {
  const { t } = useTranslation();
  const { data: authorsList = [], isLoading: authorsLoading, isError: authorsError } = useAuthorsGetQuery();
  const { data: readersList = [], isLoading: readersLoading, isError: readersError } = useReadersGetQuery();
  const { data: seriesList = [], isLoading: seriesLoading, isError: seriesError } = useSeriesGetQuery();
  const [save] = useBooksEditMutation();
  const [name, setName] = useUpdatingState(info.name);
  const [authors, setAuthors] = useUpdatingState(info.authors);
  const [readers, setReaders] = useUpdatingState(info.readers);
  const [series, setSeries] = useUpdatingState(info.series);
  const dispatch = useAppDispatch();

  const error = authorsError || readersError || seriesError;
  const modified = name !== info.name || authors !== info.authors || readers !== info.readers || series !== info.series;
  const valid = !!name && authors.length !== 0 && readers.length !== 0;

  const handleSeriesChange = (ids: string[]) => {
    const newSeries = series.filter(({ id }) => ids.includes(id));
    for (const id of ids) {
      if (!newSeries.some(entry => entry.id === id)) {
        newSeries.push({ id });
      }
    }
    setSeries(newSeries);
  };

  const getSeriesNumberChangeHandler =
    (id: string): TextFieldProps['onChange'] =>
    ({ target: { value } }) => {
      const index = series.findIndex(entry => entry.id === id);
      if (index === -1) return;
      const newSeries = [...series];
      newSeries[index] = { id, number: value };
      setSeries(newSeries);
    };

  const handleSave = () => {
    const { cover } = info;
    try {
      const info: BookInfoDto = {
        name,
        authors,
        readers,
        series,
        cover,
      };
      save({ id, bookDto: { info, chapters } }).unwrap();
    } catch (e) {
      const text = e instanceof Error ? e.message : t(`got unknown error while editing book`);
      dispatch(addSnackbar({ severity: 'error', text }));
    }
  };

  const getSeriesName = (id: string) => {
    const { name } = seriesList.find(entry => entry.id === id) || {};
    return name || id;
  };

  const handleCancel = () => {
    setName(info.name);
    setAuthors(info.authors);
    setReaders(info.readers);
    setSeries(info.series);
  };

  return (
    <ErrorWrapper error={error}>
      <Stack spacing={2} mt={2}>
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
        <MultiSelect
          list={seriesList}
          label={t('Series')}
          values={series.map(({ id }) => id)}
          onChange={handleSeriesChange}
          loading={seriesLoading}
        />
        {series.map(({ id, number }) => (
          <TextField
            key={id}
            fullWidth
            label={t('Number in {{series}} series', { series: getSeriesName(id) })}
            value={number || ''}
            onChange={getSeriesNumberChangeHandler(id)}
          />
        ))}
        {modified && (
          <Stack direction='row' spacing={1} mt={1}>
            <Button variant='outlined' onClick={handleCancel}>
              {t('Cancel')}
            </Button>
            <Button variant='contained' disabled={!valid} onClick={handleSave}>
              {t('Save')}
            </Button>
          </Stack>
        )}
      </Stack>
    </ErrorWrapper>
  );
};

export default EditBookInfo;
