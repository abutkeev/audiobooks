import { Button } from '@mui/material';
import { AnyAction } from '@reduxjs/toolkit';
import { FC, MutableRefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { removeTitles, resetTitles, stripPrefixNumbers } from './useUploading';

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
  );
};

export default ExtraButtons;
