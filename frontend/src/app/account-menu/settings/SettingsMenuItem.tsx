import { FC } from 'react';
import { Settings } from '@mui/icons-material';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { AccountMenuDialogItemProps } from '..';
import { useTranslation } from 'react-i18next';

const SettingsMenuItem: FC<AccountMenuDialogItemProps> = ({ setShowDialog, closeMenu }) => {
  const { t } = useTranslation();

  const handleShowDialog = () => {
    setShowDialog(true);
    closeMenu();
  };

  return (
    <MenuItem onClick={handleShowDialog}>
      <ListItemIcon>
        <Settings />
      </ListItemIcon>
      <ListItemText>{t('Settings')}</ListItemText>
    </MenuItem>
  );
};

export default SettingsMenuItem;
