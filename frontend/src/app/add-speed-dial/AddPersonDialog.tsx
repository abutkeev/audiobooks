import { useState } from 'react';
import { TextField } from '@mui/material';
import CustomDialog from '../../components/common/CustomDialog';
import { useAppDispatch } from '../../store';
import { addSnackbar } from '../../store/features/snackbars';
import { useAuthorsCreateMutation, useReadersCreateMutation } from '../../api/api';

interface AddPersonDialogProps {
  type?: 'reader' | 'author';
  close(): void;
}

const AddPersonDialog: React.FC<AddPersonDialogProps> = ({ type, close }) => {
  const [name, setName] = useState('');
  const dispatch = useAppDispatch();
  const [createAuthor] = useAuthorsCreateMutation();
  const [createReader] = useReadersCreateMutation();

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
      const text = e instanceof Error ? e.message : `got unknown error while creating ${type}`;
      dispatch(addSnackbar({ severity: 'error', text }));
    }
  };

  const handleClose = () => {
    close();
    setName('');
  };

  return (
    <CustomDialog
      open={!!type}
      title={`Add ${type}`}
      close={handleClose}
      onConfirm={handleCreate}
      confirmButtonText='Create'
      confirmButtonProps={{ disabled: !name }}
      content={
        <TextField
          sx={{ mt: 1 }}
          fullWidth
          required
          label='Name'
          value={name}
          onChange={({ target: { value } }) => setName(value)}
          onKeyDown={e => e.stopPropagation()}
          error={!name}
        />
      }
    />
  );
};

export default AddPersonDialog;
