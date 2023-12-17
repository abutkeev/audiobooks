import { Button, Stack } from '@mui/material';
import UploadButton from '@/components/common/UploadButton';
import { Delete, Upload } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/store';
import { addSnackbar } from '@/store/features/snackbars';
import axios from 'axios';
import { api, useBooksExtractCoverMutation, useBooksRemoveCoverMutation } from '@/api/api';
import { useTranslation } from 'react-i18next';
import useMobile from '@/hooks/useMobile';

interface EditCoverProps {
  bookId: string;
  cover?: string;
}

const EditCover: React.FC<EditCoverProps> = ({ bookId, cover }) => {
  const { t } = useTranslation();
  const { token } = useAppSelector(({ auth }) => auth);
  const dispatch = useAppDispatch();
  const [remove] = useBooksRemoveCoverMutation();
  const [extract] = useBooksExtractCoverMutation();
  const mobile = useMobile();

  const handleUpload = async (file: File) => {
    try {
      const data = new FormData();
      data.append('file', file);
      await axios.request({
        method: 'PUT',
        url: `/api/books/${bookId}/cover`,
        data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(api.util.invalidateTags(['books']));
    } catch (e) {
      dispatch(addSnackbar({ severity: 'error', text: t(`Got error then uploading cover`) }));
    }
  };

  const handleRemove = async () => {
    try {
      await remove({ id: bookId }).unwrap();
    } catch (e) {
      dispatch(addSnackbar({ severity: 'error', text: t(`Got error then removing cover`) }));
    }
  };

  const handleExtract = async () => {
    try {
      await extract({ id: bookId }).unwrap();
    } catch (e) {
      dispatch(addSnackbar({ severity: 'error', text: t(`Got error then extracting cover`) }));
    }
  };

  return (
    <Stack direction='column' spacing={1} flexGrow={1} alignItems='center'>
      {cover && <img width={200} src={cover} style={{ margin: 5, borderRadius: 5 }} />}
      <Stack direction={mobile ? 'column' : 'row'} spacing={1} width='100%' justifyContent='center'>
        <UploadButton
          startIcon={<Upload />}
          variant='contained'
          onChange={list => list && list[0] && handleUpload(list[0])}
          accept='image/*'
          fullWidth={mobile}
        >
          {t('Upload')}
        </UploadButton>
        <Button
          startIcon={<Delete />}
          disabled={!cover}
          variant='contained'
          color='error'
          onClick={handleRemove}
          fullWidth={mobile}
        >
          {t('Remove')}
        </Button>
        <Button variant='outlined' onClick={handleExtract} fullWidth={mobile}>
          {t('Extract')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default EditCover;
