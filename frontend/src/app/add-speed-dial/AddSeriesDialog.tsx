import { useState } from 'react';
import { Stack, TextField } from '@mui/material';
import CustomDialog from '@/components/common/CustomDialog';
import { useAppDispatch } from '@/store';
import { addSnackbar } from '@/store/features/snackbars';
import { useAuthorsGetQuery, useSeriesCreateMutation } from '@/api/api';
import LoadingWrapper from '@/components/common/LoadingWrapper';
import { useTranslation } from 'react-i18next';
import MultiSelect from '@/components/common/MultiSelect';

interface AddSeriesDialogProps {
  open: boolean;
  close(): void;
}

const AddSeriesDialog: React.FC<AddSeriesDialogProps> = ({ open, close }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [authors, setAuthors] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const { data = [], isLoading, isError } = useAuthorsGetQuery();
  const [create] = useSeriesCreateMutation();

  const handleCreate = () => {
    if (authors.length === 0) return;

    try {
      create({ newSeriesDto: { name, authors } }).unwrap();
    } catch (e) {
      const text = e instanceof Error ? e.message : t(`got unknown error while creating series`);
      dispatch(addSnackbar({ severity: 'error', text }));
    }
  };

  const handleClose = () => {
    close();
    setName('');
    setAuthors([]);
  };

  return (
    <CustomDialog
      open={!!open}
      title={t(`Add series`)}
      close={handleClose}
      onConfirm={handleCreate}
      confirmButtonText={t('Create')}
      confirmButtonProps={{ disabled: !name || authors.length === 0 || isLoading || isError }}
      content={
        <LoadingWrapper loading={isLoading} error={isError}>
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
              list={data}
              label={t('Authors')}
              values={authors}
              onChange={setAuthors}
              required
              selectOptionsText={t('Select authors')}
              noOptionsText={t('No authors')}
            />
          </Stack>
        </LoadingWrapper>
      }
    />
  );
};

export default AddSeriesDialog;
