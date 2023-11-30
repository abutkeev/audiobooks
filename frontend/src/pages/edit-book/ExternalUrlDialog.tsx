import { FC, useState } from 'react';
import CustomDialog, { AbortOperation } from '@/components/common/CustomDialog';
import { useTranslation } from 'react-i18next';
import { Stack, TextField } from '@mui/material';
import { BooksGetChaptersFromUrlApiResponse, useLazyBooksGetChaptersFromUrlQuery } from '@/api/api';
import getErrorMessage from '@/utils/getErrorMessage';
import ErrorAlert from '@/components/common/ErrorAlert';

interface ExternalUrlDialogProps {
  open: boolean;
  onClose(): void;
  setChapters(chapters: BooksGetChaptersFromUrlApiResponse): void;
}

const ExternalUrlDialog: FC<ExternalUrlDialogProps> = ({ open, onClose, setChapters }) => {
  const { t } = useTranslation();
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [getChapters] = useLazyBooksGetChaptersFromUrlQuery();

  const getUrlError = () => {
    if (!url) return;
    try {
      new URL(url);
    } catch {
      return t('Invalid URL');
    }
  };

  const valid = !!url && !getUrlError();

  const handleGetChapters = async () => {
    setError('');
    try {
      setChapters(await getChapters({ url: btoa(url) }).unwrap());
    } catch (e) {
      if (e && typeof e === 'object' && 'status' in e && e.status === 406) {
        setError(t('URL is unsupported'));
      } else {
        setError(getErrorMessage(e, t('got error while getting chapters')));
      }
      throw new AbortOperation();
    }
  };

  const handleClose = () => {
    onClose();
    setUrl('');
    setError('');
  };

  return (
    <CustomDialog
      open={open}
      close={handleClose}
      title={t('External book URL')}
      content={
        <Stack spacing={2} sx={{ mt: 1 }}>
          <ErrorAlert error={error} />
          <TextField
            label={t('External book URL')}
            fullWidth
            required
            value={url}
            onChange={({ target: { value } }) => setUrl(value)}
            error={!valid}
            helperText={getUrlError()}
          />
        </Stack>
      }
      onConfirm={handleGetChapters}
      confirmButtonText={t('Get chapters')}
      confirmButtonProps={{ disabled: !valid }}
    />
  );
};

export default ExternalUrlDialog;
