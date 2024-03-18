import { forwardRef } from 'react';
import { Paper, Stack, Typography } from '@mui/material';
import { BugReport, GitHub, Telegram } from '@mui/icons-material';
import useMobile from '@/hooks/useMobile';
import { useTranslation } from 'react-i18next';
import FooterBarSeparator from './FooterBarSeparator';
import FooterLink from './FooterLink';
import formatIsoTimeString from '@/utils/formatIsoTimeString';

const FooterBar = forwardRef<HTMLDivElement>((_, ref) => {
  const { t } = useTranslation();
  const mobile = useMobile();

  return (
    <Paper ref={ref} sx={{ position: 'fixed', bottom: 0, width: '100%' }}>
      <Stack spacing={1} direction={'row'} m={1} justifyContent='center' alignItems='center'>
        <Typography variant='body2'>&copy; 2023–2024, {t('Alexey Butkeev')}</Typography>
        {!mobile && (
          <>
            <FooterBarSeparator />
            <FooterLink icon={<GitHub />} href='https://github.com/abutkeev/audiobooks'>
              {t('Source code')}
            </FooterLink>
            <FooterBarSeparator />
            <FooterLink icon={<Telegram />} href='https://t.me/audiobooks_auth_bot'>
              {t('Authorization bot')}
            </FooterLink>
            <FooterBarSeparator />
          </>
        )}
        <FooterLink icon={<BugReport />} href='https://github.com/abutkeev/audiobooks/issues/new'>
          {t('Report an issue')}
        </FooterLink>
      </Stack>
      {!mobile && (
        <Stack spacing={1} direction='row' mb={1} justifyContent='center' alignItems='center'>
          <Typography variant='body2'>
            {t('Version')}: {VERSION}
          </Typography>
          <FooterBarSeparator />
          <Typography variant='body2'>
            {t('Build date')}: {formatIsoTimeString(BUILD_DATE)}
          </Typography>
        </Stack>
      )}
    </Paper>
  );
});

export default FooterBar;
