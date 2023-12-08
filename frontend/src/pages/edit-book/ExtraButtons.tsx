import { Button } from '@mui/material';
import { AnyAction } from '@reduxjs/toolkit';
import { FC, MutableRefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { decodeTranslit, removeTitles, resetTitles, stripPrefixNumbers } from './useUploading';
import MenuButton from '@/components/common/MenuButton';

interface ExtraButtonsProps {
  uploading: boolean;
  dispatch(action: AnyAction): void;
  abortControllerRef?: MutableRefObject<AbortController | undefined>;
}

const ExtraButtons: FC<ExtraButtonsProps> = ({ uploading, dispatch, abortControllerRef }) => {
  const { t } = useTranslation();
  if (uploading) {
    if (!abortControllerRef) return;

    return (
      <Button variant='outlined' color='error' onClick={() => abortControllerRef.current?.abort()}>
        {t('Abort upload')}
      </Button>
    );
  }

  return (
    <MenuButton
      actions={[
        { title: t('Remove titles'), onClick: () => dispatch(removeTitles()) },
        { title: t('Reset titles'), onClick: () => dispatch(resetTitles()) },
        { title: t('Strip prefix numbers'), onClick: () => dispatch(stripPrefixNumbers()) },
        { title: t('Decode translit'), onClick: () => dispatch(decodeTranslit()) },
      ]}
      variant='outlined'
    />
  );
};

export default ExtraButtons;
