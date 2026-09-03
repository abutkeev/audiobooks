import { FC } from 'react';
import { Box, Paper, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import DeleteButton from '@/components/common/DeleteButton';
import { useAppDispatch } from '@/store';
import { removeCachedMedia } from '@/store/features/media-cache';
import formatSize from '@/utils/formatSize';
import { CachedBook as CachedBookInfo } from './useCachedBooks';

interface CachedBookProps {
  book: CachedBookInfo;
}

const CachedBook: FC<CachedBookProps> = ({ book: { name, author, urls, size } }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleRemove = () => {
    dispatch(removeCachedMedia(urls));
  };

  return (
    <Paper square variant='outlined'>
      <Stack spacing={1} direction='row' sx={{ px: 1.5, py: 0.5, alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography noWrap>{name}</Typography>
          <Typography noWrap variant='body2' sx={{ color: 'text.secondary' }}>
            {[author, t('{{count}} chapters', { count: urls.length }), size !== 0 && formatSize(size)]
              .filter(Boolean)
              .join(' · ')}
          </Typography>
        </Box>
        <DeleteButton
          confirmationTitle={t('Clear cache confirmation')}
          confirmationBody={t('Remove cached chapters of {{name}}?', { name })}
          onConfirm={handleRemove}
        />
      </Stack>
    </Paper>
  );
};

export default CachedBook;
