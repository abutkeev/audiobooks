import { Clear, ContentPaste } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, TextField } from '@mui/material';
import { useContext, useMemo, useRef, useState } from 'react';
import { PlayerStateContext, updateBookState } from '../state/usePlayerState';

interface UpdateStateDialogProps {
  show: boolean;
  onClose(): void;
}

const UpdateStateDialog: React.FC<UpdateStateDialogProps> = ({ show, onClose }) => {
  const { dispatch } = useContext(PlayerStateContext);
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
    dispatch(updateBookState(JSON.parse(value)));
    onClose();
  };
  const handlePaste = () => {
    if (textFieldRef.current) {
      textFieldRef.current.focus();
      document.execCommand('paste');
      textFieldRef.current.blur();
    }
  };

  return (
    <Dialog open={show} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle>Update player state</DialogTitle>
      <DialogContent>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleUpdateClick} disabled={!valid}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateStateDialog;
