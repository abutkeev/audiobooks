import { useState } from 'react';
import { TextField } from '@mui/material';
import CustomDialog from '../../components/common/CustomDialog';

interface AddReaderDialogProps {
  open: boolean;
  close(): void;
}

const AddReaderDialog: React.FC<AddReaderDialogProps> = ({ open, close }) => {
  const [name, setName] = useState('');

  const handleClose = () => {
    close();
    setName('');
  };

  return (
    <CustomDialog
      open={open}
      title={'Add reader'}
      close={handleClose}
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
