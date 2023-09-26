import { useState } from 'react';
import { TextField } from '@mui/material';
import CustomDialog from '../../components/common/CustomDialog';
import { useReadersCreateMutation } from '../../api/api';
import { useAppDispatch } from '../../store';
import { addSnackbar } from '../../store/features/snackbars';

interface AddReaderDialogProps {
  open: boolean;
  close(): void;
}

const AddReaderDialog: React.FC<AddReaderDialogProps> = ({ open, close }) => {
  const [name, setName] = useState('');
  const [create] = useReadersCreateMutation();
  const dispatch = useAppDispatch();

  const handleCreate = () => {
    try {
      create({ nameDto: { name } }).unwrap();
    } catch (e) {
      const text = e instanceof Error ? e.message : 'got unknown error while creating reader';
      dispatch(addSnackbar({ severity: 'error', text }));
    }
  };

  const handleClose = () => {
    close();
    setName('');
  };

  return (
    <CustomDialog
      open={open}
      title={'Add reader'}
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

export default AddReaderDialog;
