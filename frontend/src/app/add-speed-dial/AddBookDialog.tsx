import { useState } from 'react';
import { Stack, TextField } from '@mui/material';
import CustomDialog from '@/components/common/CustomDialog';
import { useAppDispatch } from '@/store';
import { addSnackbar } from '@/store/features/snackbars';
import { useAuthorsGetQuery, useBooksCreateMutation, useReadersGetQuery, useSeriesGetQuery } from '@/api/api';
import CustomComboBox from '@/components/common/CustomComboBox';
import { useTranslation } from 'react-i18next';
import getErrorMessage from '@/utils/getErrorMessage';
import CustomSwitch from '@/components/common/CustomSwitch';
import { useNavigate } from 'react-router-dom';
import MultiSelect from '@/components/common/MultiSelect';

interface AddBookDialogProps {
  open: boolean;
  close(): void;
}

const AddBookDialog: React.FC<AddBookDialogProps> = ({ open, close }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [authors, setAuthors] = useState<string[]>([]);
  const [readers, setReaders] = useState<string[]>([]);
  const [seriesId, setSeriesId] = useState('');
  const [seriesNumber, setSeriesNumber] = useState('');
  const [gotoBookEditPage, setGotoBookEditPage] = useState(true);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: authorsList = [], isLoading: authorsLoading, isError: authorsError } = useAuthorsGetQuery();
  const { data: readersList = [], isLoading: readersLoading, isError: readersError } = useReadersGetQuery();
  const { data: seriesList = [], isLoading: seriesLoading, isError: seriesError } = useSeriesGetQuery();
  const [create] = useBooksCreateMutation();

  const loading = authorsLoading || readersLoading || seriesLoading;
  const error = authorsError || readersError || seriesError;
  const valid = !!name && authors.length !== 0 && readers.length !== 0;

  const handleCreate = async () => {
    try {
      const id = await create({
        bookInfoDto: {
          name,
          authors,
          readers,
          series: seriesId ? [{ id: seriesId, number: seriesNumber }] : [],
        },
      }).unwrap();
      if (gotoBookEditPage) {
        navigate(`/edit/${id}`);
      }
    } catch (e) {
      const text = getErrorMessage(e, t(`got unknown error while creating book`));
      dispatch(addSnackbar({ severity: 'error', text }));
    }
  };

  const handleClose = () => {
    close();
    setName('');
    setAuthors([]);
    setReaders([]);
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
          <MultiSelect
            list={authorsList}
            label={t('Author')}
            values={authors}
            onChange={setAuthors}
            required
            selectOptionsText={t('Select authors')}
            noOptionsText={t('No authors')}
          />
          <MultiSelect
            list={readersList}
            label={t('Reader')}
            values={readers}
            onChange={setReaders}
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
          />
          <TextField
            fullWidth
            label={t('Series number')}
            value={seriesId ? seriesNumber : ''}
            disabled={!seriesId}
            onChange={({ target: { value } }) => setSeriesNumber(value)}
          />
          <CustomSwitch label={t('Goto book edit page')} checked={gotoBookEditPage} onChange={setGotoBookEditPage} />
        </Stack>
      }
    />
  );
};

export default AddBookDialog;
