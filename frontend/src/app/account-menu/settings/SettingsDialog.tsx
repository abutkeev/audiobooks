import { FC, useEffect } from 'react';
import CustomDialog from '../../../components/common/CustomDialog';
import { MenuItem, Stack, TextField, TextFieldProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useProfileGetSettingsQuery, useProfileSetSettingsMutation } from '../../../api/api';

interface SettingsDialogProps {
  open: boolean;
  close(): void;
}

const SettingsDialog: FC<SettingsDialogProps> = ({ open, close }) => {
  const { t, i18n } = useTranslation();
  const { language, changeLanguage } = i18n;
  const { data: settings } = useProfileGetSettingsQuery();
  const [setSettings] = useProfileSetSettingsMutation();

  useEffect(() => {
    if (settings?.language && settings.language !== language) {
      changeLanguage(settings.language);
    }
  }, [settings]);

  const handleLanguageChange: TextFieldProps['onChange'] = async ({ target: { value } }) => {
    changeLanguage(value);
    await setSettings({ settingsDto: { language: value } });
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
        </Stack>
      }
    />
  );
};

export default SettingsDialog;
