import { FC, useEffect } from 'react';
import CustomDialog from '@/components/common/CustomDialog';
import { MenuItem, Stack, TextField, TextFieldProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLazyProfileGetSettingsQuery, useProfileSetSettingsMutation } from '@/api/api';
import useAuthData from '@/hooks/useAuthData';
import { useAppDispatch, useAppSelector } from '@/store';
import { setThemeMode } from '@/store/features/theme';

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
  const theme = useAppSelector(({ theme }) => theme.mode);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!auth || !['uninitialized', 'fulfilled'].includes(status)) return;
    getSettings(undefined, true)
      .unwrap()
      .then(settings => {
        if (settings?.language && settings.language !== language) {
          changeLanguage(settings.language);
        }
        if (settings?.theme && settings.theme !== theme) {
          dispatch(setThemeMode(settings.theme));
        }
      });
  }, [status, auth, changeLanguage, getSettings, language]);

  const handleLanguageChange: TextFieldProps['onChange'] = async ({ target: { value } }) => {
    changeLanguage(value);
    if (auth) {
      await setSettings({ settingsDto: { language: value } });
    }
  };

  const handleThemeChange: TextFieldProps['onChange'] = async ({ target: { value } }) => {
    dispatch(setThemeMode(value));

    if (auth) {
      await setSettings({ settingsDto: { theme: value } });
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
