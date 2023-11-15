import { useState } from 'react';
import { Stack, TextField } from '@mui/material';
import CustomDialog from '../../components/common/CustomDialog';
import { useAppDispatch } from '../../store';
import { addSnackbar } from '../../store/features/snackbars';
import { useAuthorsGetQuery, useBooksCreateMutation, useReadersGetQuery, useSeriesGetQuery } from '../../api/api';
import CustomComboBox from '../../components/common/CustomComboBox';
import { useTranslation } from 'react-i18next';
import getErrorMessage from '../../utils/getErrorMessage';

interface AddBookDialogProps {
  open: boolean;
  close(): void;
}

const AddBookDialog: React.FC<AddBookDialogProps> = ({ open, close }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [readerId, setReaderId] = useState('');
  const [seriesId, setSeriesId] = useState('');
  const [seriesNumber, setSeriesNumber] = useState('');
  const dispatch = useAppDispatch();
  const { data: authors = [], isLoading: authorsLoading, isError: authorsError } = useAuthorsGetQuery();
  const { data: readers = [], isLoading: readersLoading, isError: readersError } = useReadersGetQuery();
  const { data: series = [], isLoading: seriesLoading, isError: seriesError } = useSeriesGetQuery();
  const [create] = useBooksCreateMutation();

  const loading = authorsLoading || readersLoading || seriesLoading;
  const error = authorsError || readersError || seriesError;
  const valid = !!name && !!authorId && !!readerId;

  const handleCreate = async () => {
    try {
      await create({
        bookInfoDto: {
          name,
          author_id: authorId,
          reader_id: readerId,
          series_id: seriesId || undefined,
          series_number: (seriesId && seriesNumber) || undefined,
        },
      }).unwrap();
    } catch (e) {
      const text = getErrorMessage(e, t(`got unknown error while creating book`));
      dispatch(addSnackbar({ severity: 'error', text }));
    }
  };

  const handleClose = () => {
    close();
    setName('');
    setAuthorId('');
    setReaderId('');
    setSeriesId('');
    setSeriesNumber('');
  };

  return (
    <CustomDialog
      open={!!open}
      title={t(`Add book`)}
      close={handleClose}
      onConfirm={handleCreate}
      confirmButtonText={t('Create')}
      confirmButtonProps={{ disabled: !valid || loading || error }}
      content={
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            required
            label={t('Name')}
            value={name}
            onChange={({ target: { value } }) => setName(value)}
            onKeyDown={e => e.stopPropagation()}
            error={!name}
          />
          <CustomComboBox options={authors} label={t('Author')} value={authorId} setValue={setAuthorId} />
          <CustomComboBox options={readers} label={t('Reader')} value={readerId} setValue={setReaderId} />
          <CustomComboBox
            options={series}
            label={t('Series')}
            value={seriesId}
            setValue={setSeriesId}
            required={false}
          />
          <TextField
            fullWidth
            label={t('Series number')}
            value={seriesId ? seriesNumber : ''}
            disabled={!seriesId}
            onChange={({ target: { value } }) => setSeriesNumber(value)}
          />
        </Stack>
      }
    />
  );
};

export default AddBookDialog;
