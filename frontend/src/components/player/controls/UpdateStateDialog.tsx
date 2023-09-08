import { Clear, ContentPaste } from '@mui/icons-material';
import { InputAdornment, TextField } from '@mui/material';
import { useMemo, useRef, useState } from 'react';
import CustomDialog from '../../common/CustomDialog';

interface UpdateStateDialogProps {
  show: boolean;
  onClose(): void;
}

const UpdateStateDialog: React.FC<UpdateStateDialogProps> = ({ show, onClose }) => {
  const [value, setValue] = useState('');
  const valid = useMemo(() => {
    if (!value) return false;
    try {
      const parsed = JSON.parse(value);
      return (
        !!parsed &&
        typeof parsed === 'object' &&
        'bookId' in parsed &&
        typeof parsed.bookId === 'string' &&
        'currentChapter' in parsed &&
        typeof parsed.currentChapter === 'number' &&
        'position' in parsed &&
        typeof parsed.position === 'number'
      );
    } catch {
      return false;
    }
  }, [value]);
  const textFieldRef = useRef<HTMLInputElement>(null);

  const handleUpdateClick = () => {
    // dispatch(updateBookState(JSON.parse(value)));
    onClose();
  };

  const handleClose = () => {
    onClose();
    setValue('');
  };

  const handlePaste = () => {
    if (textFieldRef.current) {
      textFieldRef.current.focus();
      document.execCommand('paste');
      textFieldRef.current.blur();
    }
  };

  return (
    <CustomDialog
      open={show}
      close={handleClose}
      onConfirm={handleUpdateClick}
      confirmButtonProps={{ disabled: !valid }}
      confirmButtonText='Update'
      title='Update player state'
      content={
        <TextField
          autoFocus
          label='New player state'
          required
          multiline
          fullWidth
          sx={{ mt: 1 }}
          error={!valid}
          value={value}
          onChange={({ target: { value } }) => setValue(value)}
          inputProps={{ ref: textFieldRef }}
          InputProps={{
            endAdornment: value ? (
              <InputAdornment position='end' onClick={() => setValue('')}>
                <Clear />
              </InputAdornment>
            ) : (
              <InputAdornment position='end' onClick={handlePaste}>
                <ContentPaste />
              </InputAdornment>
            ),
          }}
        />
      }
    />
  );
};

export default UpdateStateDialog;
