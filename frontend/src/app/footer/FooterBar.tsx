import { forwardRef } from 'react';
import { Paper, Stack, Typography } from '@mui/material';
import { BugReport, Cached, GitHub, Telegram } from '@mui/icons-material';
import useMobile from '@/hooks/useMobile';
import { useTranslation } from 'react-i18next';
import FooterBarSeparator from './FooterBarSeparator';
import FooterLink from './FooterLink';
import formatIsoTimeString from '@/utils/formatIsoTimeString';
import CustomAccordion from '@/components/common/CustomAccordion';

const src_link = 'https://github.com/abutkeev/audiobooks';
const bot_link = 'https://t.me/audiobooks_auth_bot';
const new_issue_link = 'https://github.com/abutkeev/audiobooks/issues/new';

const FooterBar = forwardRef<HTMLDivElement>((_, ref) => {
  const { t } = useTranslation();
  const mobile = useMobile();

  return (
    <Paper ref={ref} sx={{ position: 'fixed', bottom: 0, width: '100%', p: 1 }}>
      {mobile ? (
        <CustomAccordion
          summary={<Typography variant='body2'>&copy; 2023–2024, {t('Alexey Butkeev')}</Typography>}
          details={
            <Stack spacing={1} direction='column'>
              <FooterLink icon={<GitHub />} href={src_link}>
                {t('Source code')}
              </FooterLink>
              <FooterLink icon={<Telegram />} href={bot_link}>
                {t('Authorization bot')}
              </FooterLink>
              <FooterLink icon={<BugReport />} href={new_issue_link}>
                {t('Report an issue')}
              </FooterLink>
              <Typography variant='body2'>
                {t('Version')}: {VERSION}
              </Typography>
              <Typography variant='body2'>
                {t('Build date')}: {formatIsoTimeString(BUILD_DATE)}
              </Typography>
              <FooterLink icon={<Cached />} onClick={() => document.location.reload()}>
                {t('Reload page')}
              </FooterLink>
            </Stack>
          }
        />
      ) : (
        <>
          <Stack spacing={1} direction='row' justifyContent='center' alignItems='center'>
            <Typography variant='body2'>&copy; 2023–2024, {t('Alexey Butkeev')}</Typography>
            <>
              <FooterBarSeparator />
              <FooterLink icon={<GitHub />} href={src_link}>
                {t('Source code')}
              </FooterLink>
              <FooterBarSeparator />
              <FooterLink icon={<Telegram />} href={bot_link}>
                {t('Authorization bot')}
              </FooterLink>
              <FooterBarSeparator />
            </>
            <FooterLink icon={<BugReport />} href={new_issue_link}>
              {t('Report an issue')}
            </FooterLink>
          </Stack>
          <Stack spacing={1} direction='row' mb={1} justifyContent='center' alignItems='center'>
            <Typography variant='body2'>
              {t('Version')}: {VERSION}
            </Typography>
            <FooterBarSeparator />
            <Typography variant='body2'>
              {t('Build date')}: {formatIsoTimeString(BUILD_DATE)}
            </Typography>
          </Stack>
        </>
      )}
    </Paper>
  );
});

export default FooterBar;
