import { FC, useEffect } from 'react';
import CustomDialog from '@/components/common/CustomDialog';
import { MenuItem, Stack, TextField, TextFieldProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLazyProfileGetSettingsQuery, useProfileSetSettingsMutation } from '@/api/api';
import useAuthData from '@/hooks/useAuthData';
import useSelectedTheme from '@/hooks/useSelectedTheme';

interface SettingsDialogProps {
  open: boolean;
  close(): void;
}

const SettingsDialog: FC<SettingsDialogProps> = ({ open, close }) => {
  const { t, i18n } = useTranslation();
  const { language, changeLanguage } = i18n;
  const auth = useAuthData();
  const [getSettings, { status }] = useLazyProfileGetSettingsQuery();
  const [setSettings] = useProfileSetSettingsMutation();
  const [theme, handleThemeChange] = useSelectedTheme();

  useEffect(() => {
    if (!auth || !['uninitialized', 'fulfilled'].includes(status)) return;
    getSettings(undefined, true)
      .unwrap()
      .then(settings => {
        if (settings?.language && settings.language !== language) {
          changeLanguage(settings.language);
        }
      });
  }, [status]);

  const handleLanguageChange: TextFieldProps['onChange'] = async ({ target: { value } }) => {
    changeLanguage(value);
    if (auth) {
      await setSettings({ settingsDto: { language: value } });
    }
  };

  const handleClose = () => {
    close();
  };

  return (
    <CustomDialog
      open={open}
      close={handleClose}
      title={t('Settings')}
      content={
        <Stack spacing={2} mt={1}>
          <TextField label={t('Language')} select required value={language} onChange={handleLanguageChange}>
            <MenuItem value='en'>{t('English')}</MenuItem>
            <MenuItem value='ru'>{t('Russian')}</MenuItem>
          </TextField>
          <TextField label={t('Theme')} select required value={theme} onChange={handleThemeChange}>
            <MenuItem value='auto'>{t('Autodetect')}</MenuItem>
            <MenuItem value='light'>{t('Light')}</MenuItem>
            <MenuItem value='dark'>{t('Dark')}</MenuItem>
          </TextField>
        </Stack>
      }
    />
  );
};

export default SettingsDialog;
