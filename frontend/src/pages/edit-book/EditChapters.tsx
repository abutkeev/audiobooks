import { Paper, Stack, Typography } from '@mui/material';
import { ChapterDto } from '../../api/api';
import { Upload } from '@mui/icons-material';
import UploadButton from '../../components/common/UploadButton';
import { useState } from 'react';
import UploadDialog from './UploadDialog';
import { useTranslation } from 'react-i18next';

interface EditChaptersProps {
  bookId: string;
  chapters: ChapterDto[];
}

const EditChapters: React.FC<EditChaptersProps> = ({ bookId, chapters }) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>();

  return (
    <>
      {chapters.map(({ title, filename }) => (
        <Paper key={title} square sx={{ p: 1 }}>
          <Stack direction='row' spacing={1}>
            <Typography flexGrow={1}>{`${title} (${filename})`}</Typography>
          </Stack>
        </Paper>
      ))}
      <Stack direction='row' spacing={1} sx={{ mt: 1 }}>
        <UploadButton
          startIcon={<Upload />}
          variant='contained'
          onChange={list => setFiles(list || undefined)}
          accept='.mp3'
          multiple
        >
          {t('Upload')}
        </UploadButton>
      </Stack>
      <UploadDialog bookId={bookId} files={files} onClose={() => setFiles(undefined)} />
    </>
  );
};

export default EditChapters;
