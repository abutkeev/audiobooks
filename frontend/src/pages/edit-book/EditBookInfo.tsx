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

interface EditBookInfoProps {
  id: string;
  info: BookInfoDto;
  chapters: ChapterDto[];
}

const EditBookInfo: React.FC<EditBookInfoProps> = ({ id, info, chapters }) => {
  const { t } = useTranslation();
  const { data: authors = [], isLoading: authorsLoading, isError: authorsError } = useAuthorsGetQuery();
  const { data: readers = [], isLoading: readersLoading, isError: readersError } = useReadersGetQuery();
  const { data: series = [], isLoading: seriesLoading, isError: seriesError } = useSeriesGetQuery();
  const [save] = useBooksEditMutation();
  const [name, setName] = useUpdatingState(info.name);
  const [authorId, setAuthorId] = useUpdatingState(info.author_id);
  const [readerId, setReaderId] = useUpdatingState(info.reader_id);
  const [seriesId, setSeriesId] = useUpdatingState(info.series_id || '');
  const [seriesNumber, setSeriesNumber] = useUpdatingState(info.series_number || '');
  const dispatch = useAppDispatch();

  const error = authorsError || readersError || seriesError;
  const modified =
    name !== info.name ||
    authorId !== info.author_id ||
    readerId !== info.reader_id ||
    seriesId !== (info.series_id || '') ||
    seriesNumber !== (info.series_number || '');
  const valid =
    !!name &&
    !!authors.find(({ id }) => id === authorId) &&
    !!readers.find(({ id }) => id === readerId) &&
    (!seriesId || !!series.find(({ id }) => id === seriesId));

  const handleSave = () => {
    const { cover } = info;
    try {
      const info: BookInfoDto = {
        name,
        author_id: authorId,
        reader_id: readerId,
        series_id: seriesId || undefined,
        series_number: (seriesId && seriesNumber) || undefined,
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
    setAuthorId(info.author_id);
    setReaderId(info.reader_id);
    setSeriesId(info.series_id || '');
    setSeriesNumber(info.series_number || '');
  };

  return (
    <ErrorWrapper error={error}>
      <TextField
        sx={{ mt: 1 }}
        fullWidth
        required
        label={t('Name.book', 'Name')}
        value={name}
        onChange={({ target: { value } }) => setName(value)}
        onKeyDown={e => e.stopPropagation()}
        error={!name}
      />
      <CustomComboBox
        options={authors}
        label={t('Author')}
        value={authorId}
        setValue={setAuthorId}
        loading={authorsLoading}
      />
      <CustomComboBox
        options={readers}
        label={t('Reader')}
        value={readerId}
        setValue={setReaderId}
        loading={readersLoading}
      />
      <CustomComboBox
        options={series}
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
    </ErrorWrapper>
  );
};

export default EditBookInfo;
