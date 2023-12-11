import { useBooksEditChapterTitleMutation } from '@/api/api';
import CustomDialog from '@/components/common/CustomDialog';
import useUpdatingState from '@/hooks/useUpdatingState';
import { useAppDispatch } from '@/store';
import { addSnackbar } from '@/store/features/snackbars';
import getErrorMessage from '@/utils/getErrorMessage';
import { TextField } from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export interface ChapterInfo {
  index: number;
  title: string;
  filename: string;
}
interface EditChapterDialogProps {
  bookId: string;
  chapter?: ChapterInfo;
  close(): void;
}

const EditChapterDialog: FC<EditChapterDialogProps> = ({ bookId, chapter, close }) => {
  const { t } = useTranslation();
  const [title, setTitile] = useUpdatingState(chapter?.title || '');
  const [edit] = useBooksEditChapterTitleMutation();
  const dispatch = useAppDispatch();

  if (!chapter) return;

  const { index, filename } = chapter;
  const handleEdit = async () => {
    try {
      await edit({ id: bookId, chapter: index, chapterEditDto: { title } }).unwrap();
    } catch (e) {
      dispatch(addSnackbar({ severity: 'error', text: getErrorMessage(e, t('Chapter update failed')) }));
    }
  };

  return (
    <CustomDialog
      open
      title={t('Edit chapter {{number}} ({{filename}}) title', { number: index + 1, filename })}
      content={
        <TextField
          sx={{ mt: 1 }}
          fullWidth
          required
          value={title}
          error={!title}
          onChange={({ target: { value } }) => setTitile(value)}
          label={t('Title')}
        />
      }
      onConfirm={handleEdit}
      confirmButtonText={t('Edit')}
      confirmButtonProps={{ disabled: !title }}
      close={close}
    />
  );
};

export default EditChapterDialog;
