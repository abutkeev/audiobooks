import { LinearProgress, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import CustomDialog, { AbortOperation } from '@/components/common/CustomDialog';
import useUploading, { setTitle, startUploading, stopUploading, setUploaded } from './useUploading';
import { Upload } from '@mui/icons-material';
import { useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '@/store';
import { addSnackbar } from '@/store/features/snackbars';
import enhancedApi from '@/api/enhancedApi';
import { useTranslation } from 'react-i18next';
import ExtraButtons from './ExtraButtons';

interface UploadDialogProps {
  bookId: string;
  files?: File[];
  onClose(): void;
}

const UploadDialog: React.FC<UploadDialogProps> = ({ bookId, files, onClose }) => {
  const { t } = useTranslation();
  const titles = useMemo(() => files?.map(file => file.name.replace(/\.mp3/i, '')), [files]);
  const [{ chapters, errors, valid }, dispatch] = useUploading(titles);
  const abortControllerRef = useRef<AbortController | undefined>();
  const [percent, setPercent] = useState(0);
  const uploading = useMemo(() => {
    const index = chapters.findIndex(({ status }) => status === 'uploading');
    if (index === -1 || !files) return;
    return { title: chapters[index].title, file: files[index] };
  }, [chapters, files]);
  const appDispatch = useAppDispatch();
  const { token } = useAppSelector(({ auth }) => auth);

  const handleUpload = async () => {
    abortControllerRef.current = new AbortController();
    try {
      for (let index = 0; index < chapters.length; index++) {
        const { title, status } = chapters[index];
        if (status === 'uploaded' || !files || !files[index]) return;
        dispatch(startUploading(index));
        const file = files[index];
        const formData = new FormData();
        formData.append('file', file, encodeURI(file.name));
        abortControllerRef.current = new AbortController();
        await axios.post(`/api/books/${bookId}/chapter/${title}`, formData, {
          onUploadProgress: ({ loaded, total }) => setPercent(total ? (loaded * 100) / total : 0),
          signal: abortControllerRef.current.signal,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(setUploaded(index));
        appDispatch(enhancedApi.util.invalidateTags(['books']));
      }
    } catch (e) {
      dispatch(stopUploading());
      if (typeof e === 'object' && e && 'message' in e && e.message === 'canceled') throw new AbortOperation();
      appDispatch(addSnackbar({ severity: 'error', text: t(`Got error then uploading chapter`) }));
      throw e;
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

  return (
    <CustomDialog
      maxWidth='lg'
      open={!!files}
      title={t('Upload files')}
      content={
        <>
          {uploading && (
            <>
              <Typography>{`${t('Uploading')} ${uploading.file.name} (${uploading.title})${
                percent > 0 && percent < 100 ? `: ${percent.toFixed(1)}%` : ''
              }`}</Typography>
              <LinearProgress
                variant={percent <= 0 || percent >= 100 ? 'indeterminate' : 'determinate'}
                value={percent}
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
              {chapters.map(({ title, status }, index) => {
                if (status === 'uploaded' || !files) return null;
                const { name } = files[index];
                return (
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
                        helperText={getHelperText(errors[index])}
                        disabled={!!uploading}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </>
      }
      extraButtons={
        <ExtraButtons abortControllerRef={abortControllerRef} uploading={!!uploading} dispatch={dispatch} />
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
