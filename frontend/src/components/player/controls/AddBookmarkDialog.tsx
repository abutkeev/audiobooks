import { useState } from 'react';
import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomDialog from '@/components/common/CustomDialog';
import { useAppDispatch, useAppSelector } from '@/store';
import { showMessage } from '@/store/features/player';
import { useBookmarksCreateMutation } from '@/api/api';
import getErrorMessage from '@/utils/getErrorMessage';

interface AddBookmarkDialogProps {
  show: boolean;
  onClose(): void;
}

const AddBookmarkDialog: React.FC<AddBookmarkDialogProps> = ({ show, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    bookId,
    state: { currentChapter, position },
  } = useAppSelector(({ player }) => player);
  const [name, setName] = useState('');
  const [create] = useBookmarksCreateMutation();

  const handleClose = () => {
    setName('');
    onClose();
  };

  const handleConfirm = async () => {
    try {
      await create({ createBookmarkDto: { bookId, name: name.trim(), currentChapter, position } }).unwrap();
      handleClose();
    } catch (e) {
      dispatch(showMessage({ severity: 'error', text: getErrorMessage(e, t('Failed to create bookmark')) }));
    }
  };

  return (
    <CustomDialog
      open={show}
      title={t('Add bookmark')}
      close={handleClose}
      onConfirm={handleConfirm}
      confirmButtonText={t('Create')}
      confirmButtonProps={{ disabled: !name.trim() }}
      content={
        <TextField
          autoFocus
          fullWidth
          label={t('Bookmark name')}
          value={name}
          onChange={({ target: { value } }) => setName(value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && name.trim()) {
              e.preventDefault();
              void handleConfirm();
            }
          }}
        />
      }
    />
  );
};

export default AddBookmarkDialog;
