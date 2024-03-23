import { FC } from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Copyright: FC = () => {
  const { t } = useTranslation();

  return <Typography variant='body2'>&copy; 2023–2024, {t('Alexey Butkeev')}</Typography>;
};

export default Copyright;
