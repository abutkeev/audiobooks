import { FC } from 'react';
import { Paper, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomDialog from '@/components/common/CustomDialog';
import DeleteButton from '@/components/common/DeleteButton';
import EmptyListWrapper from '@/components/common/EmptyListWrapper';
import LoadingWrapper from '@/components/common/LoadingWrapper';
import useMobile from '@/hooks/useMobile';
import { useAppDispatch } from '@/store';
import { removeCachedMedia } from '@/store/features/media-cache';
import formatSize from '@/utils/formatSize';
import CachedBook from './CachedBook';
import useCachedBooks from './useCachedBooks';

interface CachedChaptersDialogContentProps {
  close(): void;
}

const CachedChaptersDialogContent: FC<CachedChaptersDialogContentProps> = ({ close }) => {
  const { t } = useTranslation();
  const mobile = useMobile();
  const dispatch = useAppDispatch();
  const { cachedBooks, available, loading, error } = useCachedBooks();

  const chapters = cachedBooks.reduce((total, { urls }) => total + urls.length, 0);
  const size = cachedBooks.reduce((total, { size }) => total + size, 0);

  const handleRemoveAll = () => {
    dispatch(removeCachedMedia(cachedBooks.flatMap(({ urls }) => urls)));
  };

  return (
    <CustomDialog
      open
      close={close}
      title={t('Cached chapters')}
      content={
        <LoadingWrapper loading={loading} error={error}>
          <EmptyListWrapper
            wrap={cachedBooks.length === 0}
            message={available ? t('No cached chapters') : t('Cache state is not available')}
          >
            <Stack spacing={1}>
              <Paper>
                {cachedBooks.map(book => (
                  <CachedBook key={book.id} book={book} />
                ))}
              </Paper>
              <Typography variant='body2' sx={{ color: 'text.secondary', alignSelf: 'flex-end' }}>
                {t('Total')}: {t('{{count}} chapters', { count: chapters })}
                {size !== 0 && ` · ${formatSize(size)}`}
              </Typography>
            </Stack>
          </EmptyListWrapper>
        </LoadingWrapper>
      }
      extraButtons={
        cachedBooks.length !== 0 && (
          <DeleteButton
            confirmationTitle={t('Clear cache confirmation')}
            confirmationBody={t('Clear all cached chapters?')}
            onConfirm={handleRemoveAll}
            tooltip=''
            deleteButtonProps={{ iconButton: false, buttonProps: { color: 'error', fullWidth: mobile } }}
          >
            {t('Delete all')}
          </DeleteButton>
        )
      }
    />
  );
};

export default CachedChaptersDialogContent;
