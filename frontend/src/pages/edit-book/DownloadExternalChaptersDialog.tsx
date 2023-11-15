import { LinearProgress, Stack, TextField, Typography } from '@mui/material';
import CustomDialog, { AbortOperation } from '../../components/common/CustomDialog';
import useUploading, { setTitle, startUploading, stopUploading, setUploaded } from './useUploading';
import { Upload } from '@mui/icons-material';
import { useMemo } from 'react';
import { useAppDispatch } from '../../store';
import { addSnackbar } from '../../store/features/snackbars';
import enhancedApi from '../../api/enhancedApi';
import { useTranslation } from 'react-i18next';
import ExtraButtons from './ExtraButtons';
import { BooksGetChaptersFromUrlApiResponse, useBooksDownloadExternalChapterMutation } from '../../api/api';
import getErrorMessage from '../../utils/getErrorMessage';

interface DownloadExternalChaptersDialogProps {
  bookId: string;
  externalChapters?: BooksGetChaptersFromUrlApiResponse;
  onClose(): void;
}

const DownloadExternalChaptersDialog: React.FC<DownloadExternalChaptersDialogProps> = ({
  bookId,
  externalChapters,
  onClose,
}) => {
  const { t } = useTranslation();
  const titles = useMemo(() => externalChapters?.map(({ title }) => title), [externalChapters]);
  const [{ chapters, errors, valid }, dispatch] = useUploading(titles);
  const downloading = useMemo(() => {
    const index = chapters.findIndex(({ status }) => status === 'uploading');
    if (index === -1 || !chapters || !externalChapters || !externalChapters[index]) return;
    return { title: chapters[index].title, url: externalChapters[index].url };
  }, [chapters, externalChapters]);
  const appDispatch = useAppDispatch();
  const [downloadChapter] = useBooksDownloadExternalChapterMutation();

  const handleUpload = async () => {
    try {
      for (let index = 0; index < chapters.length; index++) {
        const { title, status } = chapters[index];
        if (status === 'uploaded' || !externalChapters || !externalChapters[index]) return;
        dispatch(startUploading(index));
        await downloadChapter({ id: bookId, externalChapterDto: { title, url: externalChapters[index].url } }).unwrap();
        dispatch(setUploaded(index));
        appDispatch(enhancedApi.util.invalidateTags(['books']));
      }
    } catch (e) {
      dispatch(stopUploading());
      appDispatch(addSnackbar({ severity: 'error', text: getErrorMessage(e, t(`Got error then uploading chapter`)) }));
      throw new AbortOperation();
    }
  };

  const getHelperText = (error: (typeof errors)[0]) => {
    switch (error) {
      case 'required':
        return t('Required field');
      case 'duplicate':
        return t('Should be unique');
    }
  };

  if (!externalChapters) return null;

  return (
    <CustomDialog
      maxWidth='lg'
      open
      title={t('Download external chapters')}
      content={
        <Stack spacing={2} sx={{ mt: 1 }}>
          {downloading && (
            <>
              <Typography>{`${t('Downloading')} ${downloading.title}`}</Typography>
              <LinearProgress variant={'indeterminate'} sx={{ mt: 1 }} />
            </>
          )}

          {chapters.map(({ title, status }, index) => {
            if (status === 'uploaded') return null;
            return (
              <TextField
                key={index}
                size='small'
                fullWidth
                label={t('Chapter {{index}} title', { index: index + 1 })}
                value={title}
                onChange={({ target: { value } }) => dispatch(setTitle({ index, title: value }))}
                required
                error={!!errors[index]}
                helperText={getHelperText(errors[index])}
                disabled={!!downloading}
              />
            );
          })}
        </Stack>
      }
      extraButtons={<ExtraButtons uploading={!!downloading} dispatch={dispatch} />}
      confirmButtonText={t('Upload')}
      confirmButtonProps={{ buttonProps: { startIcon: <Upload /> }, disabled: !valid || !!downloading }}
      cancelButtonProps={{ disabled: !!downloading }}
      onConfirm={handleUpload}
      close={onClose}
    />
  );
};

export default DownloadExternalChaptersDialog;
