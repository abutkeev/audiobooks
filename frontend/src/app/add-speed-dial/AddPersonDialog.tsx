import { useState } from 'react';
import { TextField } from '@mui/material';
import CustomDialog from '@/components/common/CustomDialog';
import { useAppDispatch } from '@/store';
import { addSnackbar } from '@/store/features/snackbars';
import { useAuthorsCreateMutation, useReadersCreateMutation } from '@/api/api';
import { useTranslation } from 'react-i18next';

interface AddPersonDialogProps {
  type?: 'reader' | 'author';
  close(): void;
}

const AddPersonDialog: React.FC<AddPersonDialogProps> = ({ type, close }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const dispatch = useAppDispatch();
  const [createAuthor] = useAuthorsCreateMutation();
  const [createReader] = useReadersCreateMutation();

  if (!type) return null;

  const handleCreate = () => {
    const nameDto = { name };
    try {
      switch (type) {
        case 'author':
          createAuthor({ nameDto }).unwrap();
          break;
        case 'reader':
          createReader({ nameDto }).unwrap();
          break;
      }
    } catch (e) {
      const localizeTypeError = () => {
        switch (type) {
          case 'author':
            return t('got unknown error while creating author');
          case 'reader':
            return t('got unknown error while creating reader');
        }
      };

      const text = e instanceof Error ? e.message : localizeTypeError();
      dispatch(addSnackbar({ severity: 'error', text }));
    }
  };

  const handleClose = () => {
    close();
    setName('');
  };

  const getHeader = () => {
    switch (type) {
      case 'author':
        return t('Add author');
      case 'reader':
        return t('Add reader');
    }
  };

  return (
    <CustomDialog
      open
      title={getHeader()}
      close={handleClose}
      onConfirm={handleCreate}
      confirmButtonText={t('Create')}
      confirmButtonProps={{ disabled: !name }}
      content={
        <TextField
          sx={{ mt: 1 }}
          fullWidth
          required
          label={t('Name')}
          value={name}
          onChange={({ target: { value } }) => setName(value)}
          error={!name}
        />
      }
    />
  );
};

export default AddPersonDialog;
