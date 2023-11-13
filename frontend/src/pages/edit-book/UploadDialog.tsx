import {
  Button,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import CustomDialog, { AbortOperation } from '../../components/common/CustomDialog';
import useUploading, {
  removeTitles,
  resetTitles,
  setProgress,
  setTitle,
  startUploading,
  stopUploading,
  stripPrefixNumbers,
} from './useUploading';
import { Upload } from '@mui/icons-material';
import { useRef } from 'react';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../../store';
import { addSnackbar } from '../../store/features/snackbars';
import enhancedApi from '../../api/enhancedApi';
import { useTranslation } from 'react-i18next';

interface UploadDialogProps {
  bookId: string;
  files?: File[];
  onClose(): void;
}

const UploadDialog: React.FC<UploadDialogProps> = ({ bookId, files, onClose }) => {
  const { t } = useTranslation();
  const [{ chapters, errors, valid, uploading }, dispatch] = useUploading(files);
  const abortControllerRef = useRef<AbortController | undefined>();
  const appDispatch = useAppDispatch();
  const { token } = useAppSelector(({ auth }) => auth);

  const handleUpload = async () => {
    abortControllerRef.current = new AbortController();
    try {
      for (const uploading of chapters) {
        dispatch(startUploading(uploading));
        const { title, file } = uploading;
        const formData = new FormData();
        formData.append('file', file, encodeURI(file.name));
        await axios.post(`/api/books/${bookId}/chapter/${title}`, formData, {
          onUploadProgress: ({ loaded, total }) => setProgress(total ? loaded / total : 0),
          signal: abortControllerRef.current.signal,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        appDispatch(enhancedApi.util.invalidateTags(['books']));
      }
    } catch (e) {
      if (typeof e === 'object' && e && 'message' in e && e.message === 'canceled') throw new AbortOperation();
      appDispatch(addSnackbar({ severity: 'error', text: t(`Got error then uploading chapter`) }));
      throw e;
    } finally {
      dispatch(stopUploading());
    }
  };

  return (
    <CustomDialog
      maxWidth='lg'
      open={!!files}
      title={t('Upload files')}
      content={
        <>
          {uploading && (
            <>
              <Typography>{`${t('Uploading')} ${uploading.file.name} (${uploading.title}): ${uploading.percent.toFixed(
                1
              )}%`}</Typography>
              <LinearProgress
                variant={uploading.percent <= 0 || uploading.percent >= 100 ? 'indeterminate' : 'determinate'}
                value={uploading.percent}
                sx={{ mt: 1 }}
              />
            </>
          )}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding='checkbox'>{t('Filename')}</TableCell>
                <TableCell>{t('Title')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chapters.map(({ title, file: { name } }, index) => (
                <TableRow key={name}>
                  <TableCell>
                    <Typography noWrap> {name}</Typography>
                  </TableCell>
                  <TableCell>
                    <TextField
                      size='small'
                      fullWidth
                      label={t('Title')}
                      value={title}
                      onChange={({ target: { value } }) => dispatch(setTitle({ index, title: value }))}
                      required
                      error={!!errors[index]}
                      helperText={errors[index]}
                      disabled={!!uploading}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      }
      extraButtons={
        uploading ? (
          <Button variant='outlined' color='error' onClick={() => abortControllerRef.current?.abort()}>
            {t('Abort upload')}
          </Button>
        ) : (
          <>
            <Button variant='outlined' onClick={() => dispatch(removeTitles())}>
              {t('Remove titles')}
            </Button>
            <Button variant='outlined' onClick={() => dispatch(resetTitles())}>
              {t('Reset titles')}
            </Button>
            <Button variant='outlined' onClick={() => dispatch(stripPrefixNumbers())}>
              {t('Strip prefix numbers')}
            </Button>
          </>
        )
      }
      confirmButtonText={t('Upload')}
      confirmButtonProps={{ buttonProps: { startIcon: <Upload /> }, disabled: !valid || !!uploading }}
      cancelButtonProps={{ disabled: !!uploading }}
      onConfirm={handleUpload}
      close={onClose}
    />
  );
};

export default UploadDialog;
