import { Button, IconButton, Paper, Stack, Typography, useTheme } from '@mui/material';
import {
  BooksGetChaptersFromUrlApiResponse,
  ChapterDto,
  useBooksClearChaptersMutation,
  useBooksUpdateDurationsMutation,
} from '@/api/api';
import { Edit, Link, Upload } from '@mui/icons-material';
import UploadButton from '@/components/common/UploadButton';
import { useState } from 'react';
import UploadDialog from './UploadDialog';
import { useTranslation } from 'react-i18next';
import ExternalUrlDialog from './ExternalUrlDialog';
import DownloadExternalChaptersDialog from './DownloadExternalChaptersDialog';
import formatTime from '@/utils/formatTime';
import { useAppDispatch } from '@/store';
import { addSnackbar } from '@/store/features/snackbars';
import getErrorMessage from '@/utils/getErrorMessage';
import ProgressButton from '@/components/common/ProgressButton';
import EditChapterDialog, { ChapterInfo } from './EditChapterDialog';
import useMobile from '@/hooks/useMobile';
import DeleteButton from '@/components/common/DeleteButton';

interface EditChaptersProps {
  bookId: string;
  chapters: ChapterDto[];
  draft: boolean;
}

const EditChapters: React.FC<EditChaptersProps> = ({ bookId, chapters, draft }) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>();
  const [editingChapter, setEditingChapter] = useState<ChapterInfo>();
  const [showExternalUrlDialog, setShowExternalUrlDialog] = useState(false);
  const [externalChapters, setExternalChapters] = useState<BooksGetChaptersFromUrlApiResponse>();
  const [updateDurations] = useBooksUpdateDurationsMutation();
  const [clearChapters] = useBooksClearChaptersMutation();
  const dispatch = useAppDispatch();
  const { palette } = useTheme();
  const mobile = useMobile();

  const handleUpdateDurations = async () => {
    try {
      await updateDurations({ id: bookId }).unwrap();
    } catch (e) {
      dispatch(addSnackbar({ severity: 'error', text: getErrorMessage(e, t('Durations update failed')) }));
    }
  };

  const handleChaptersClear = async () => {
    try {
      await clearChapters({ id: bookId }).unwrap();
    } catch (e) {
      dispatch(addSnackbar({ severity: 'error', text: getErrorMessage(e, t('Clear chapters failed')) }));
    }
  };

  return (
    <>
      {chapters.map(({ title, filename, duration }, index) => (
        <Paper key={title} square sx={{ p: 1, ':hover': { backgroundColor: palette.primary.dark } }}>
          <Stack direction='row' spacing={1} alignItems='center'>
            <Typography flexGrow={1}>{`${title} (${filename})`}</Typography>
            <IconButton onClick={() => setEditingChapter({ index, title, filename })}>
              <Edit />
            </IconButton>
            {duration && <Typography>{formatTime(duration)}</Typography>}
          </Stack>
        </Paper>
      ))}
      <Stack direction={mobile ? 'column' : 'row'} spacing={1} sx={{ mt: 1 }}>
        <UploadButton
          startIcon={<Upload />}
          variant='contained'
          onChange={list => setFiles(list || undefined)}
          accept='.mp3'
          multiple
        >
          {t('Upload')}
        </UploadButton>
        <Button startIcon={<Link />} variant='contained' onClick={() => setShowExternalUrlDialog(true)}>
          {t('Download from external URL')}
        </Button>
        <ProgressButton variant='outlined' buttonProps={{ fullWidth: mobile }} onClick={handleUpdateDurations}>
          {t('Update durations')}
        </ProgressButton>
        <DeleteButton
          tooltip={!chapters.length ? t('No chapters') : draft ? t('Clear chapters') : t('Book must be draft')}
          confirmationTitle={t('Clear chapters')}
          confirmationBody={t('Clear chapter?')}
          confirmButtonText={t('Clear')}
          onConfirm={handleChaptersClear}
          deleteButtonProps={{
            disabled: !chapters.length || !draft,
            iconButton: false,
            variant: 'outlined',
            buttonProps: { color: 'error' },
          }}
        >
          {t('Clear chapters')}
        </DeleteButton>
      </Stack>
      <UploadDialog bookId={bookId} files={files} onClose={() => setFiles(undefined)} />
      <ExternalUrlDialog
        open={showExternalUrlDialog}
        onClose={() => setShowExternalUrlDialog(false)}
        setChapters={setExternalChapters}
      />
      <DownloadExternalChaptersDialog
        bookId={bookId}
        externalChapters={externalChapters}
        onClose={() => setExternalChapters(undefined)}
      />
      <EditChapterDialog bookId={bookId} chapter={editingChapter} close={() => setEditingChapter(undefined)} />
    </>
  );
};

export default EditChapters;
