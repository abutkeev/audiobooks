import { FC } from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const start = 2023;
const end = BUILD_DATE ? new Date(BUILD_DATE).getFullYear() : new Date().getFullYear();
const years = start === end ? start : `${start}–${end}`;

const Copyright: FC = () => {
  const { t } = useTranslation();

  return (
    <Typography variant='body2'>
      &copy; {years}, {t('Alexey Butkeev')}
    </Typography>
  );
};

export default Copyright;
