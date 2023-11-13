import { FC } from 'react';
import CustomDialog from '../../../components/common/CustomDialog';
import { MenuItem, Stack, TextField, TextFieldProps } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface SettingsDialogProps {
  open: boolean;
  close(): void;
}

const SettingsDialog: FC<SettingsDialogProps> = ({ open, close }) => {
  const { t, i18n } = useTranslation();
  const { language, changeLanguage } = i18n;

  const handleLanguageChange: TextFieldProps['onChange'] = ({ target: { value } }) => {
    changeLanguage(value);
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
