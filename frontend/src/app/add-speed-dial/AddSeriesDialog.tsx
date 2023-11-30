import { useState } from 'react';
import { TextField } from '@mui/material';
import CustomDialog from '@/components/common/CustomDialog';
import { useAppDispatch } from '@/store';
import { addSnackbar } from '@/store/features/snackbars';
import { useAuthorsGetQuery, useSeriesCreateMutation } from '@/api/api';
import CustomComboBox from '@/components/common/CustomComboBox';
import LoadingWrapper from '@/components/common/LoadingWrapper';
import { useTranslation } from 'react-i18next';

interface AddSeriesDialogProps {
  open: boolean;
  close(): void;
}

const AddSeriesDialog: React.FC<AddSeriesDialogProps> = ({ open, close }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [authorId, setAuthorId] = useState('');
  const dispatch = useAppDispatch();
  const { data = [], isLoading, isError } = useAuthorsGetQuery();
  const [create] = useSeriesCreateMutation();

  const handleCreate = () => {
    try {
      create({ newSeriesDto: { name, author_id: authorId } }).unwrap();
    } catch (e) {
      const text = e instanceof Error ? e.message : t(`got unknown error while creating series`);
      dispatch(addSnackbar({ severity: 'error', text }));
    }
  };

  const handleClose = () => {
    close();
    setName('');
    setAuthorId('');
  };

  return (
    <CustomDialog
      open={!!open}
      title={t(`Add series`)}
      close={handleClose}
      onConfirm={handleCreate}
      confirmButtonText={t('Create')}
      confirmButtonProps={{ disabled: !name || !authorId || isLoading || isError }}
      content={
        <LoadingWrapper loading={isLoading} error={isError}>
          <TextField
            sx={{ mt: 1 }}
            fullWidth
            required
            label={t('Name')}
            value={name}
            onChange={({ target: { value } }) => setName(value)}
            onKeyDown={e => e.stopPropagation()}
            error={!name}
          />
          <CustomComboBox options={data} label={t('Author')} value={authorId} setValue={setAuthorId} />
        </LoadingWrapper>
      }
    />
  );
};

export default AddSeriesDialog;
