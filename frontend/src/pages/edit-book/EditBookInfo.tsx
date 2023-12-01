import {
  BookInfoDto,
  ChapterDto,
  useAuthorsGetQuery,
  useBooksEditMutation,
  useReadersGetQuery,
  useSeriesGetQuery,
} from '@/api/api';
import { Button, Stack, TextField } from '@mui/material';
import CustomComboBox from '@/components/common/CustomComboBox';
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
  const [seriesId, setSeriesId] = useUpdatingState(info.series[0]?.id || '');
  const [seriesNumber, setSeriesNumber] = useUpdatingState(info.series[0]?.number || '');
  const dispatch = useAppDispatch();

  const error = authorsError || readersError || seriesError;
  const modified =
    name !== info.name ||
    authors !== info.authors ||
    readers !== info.readers ||
    seriesId !== (info.series[0]?.id || '') ||
    seriesNumber !== (info.series[0]?.number || '');
  const valid = !!name && authors.length !== 0 && readers.length !== 0;

  const handleSave = () => {
    const { cover } = info;
    try {
      const info: BookInfoDto = {
        name,
        authors,
        readers,
        series: seriesId ? [{ id: seriesId, number: seriesNumber }] : [],
        cover,
      };
      save({ id, bookDto: { info, chapters } }).unwrap();
    } catch (e) {
      const text = e instanceof Error ? e.message : t(`got unknown error while editing book`);
      dispatch(addSnackbar({ severity: 'error', text }));
    }
  };

  const handleCancel = () => {
    setName(info.name);
    setAuthors(info.authors);
    setReaders(info.readers);
    setSeriesId(info.series[0]?.id || '');
    setSeriesNumber(info.series[0]?.number || '');
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
        <CustomComboBox
          options={seriesList}
          label={t('Series')}
          value={seriesId}
          setValue={setSeriesId}
          required={false}
          loading={seriesLoading}
        />
        {seriesId && (
          <TextField
            sx={{ mt: 2 }}
            fullWidth
            label={t('Series number')}
            value={seriesId ? seriesNumber : ''}
            disabled={!seriesId}
            onChange={({ target: { value } }) => setSeriesNumber(value)}
          />
        )}
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
