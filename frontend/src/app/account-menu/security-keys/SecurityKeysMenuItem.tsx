import { FC } from 'react';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { AccountMenuDialogItemProps } from '..';
import { Fingerprint } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const SecurityKeysMenuItem: FC<AccountMenuDialogItemProps> = ({ setShowDialog, closeMenu }) => {
  const { t } = useTranslation();
  const handleShowDialog = () => {
    setShowDialog(true);
    closeMenu();
  };

  return (
    <MenuItem onClick={handleShowDialog}>
      <ListItemIcon>
        <Fingerprint />
      </ListItemIcon>
      <ListItemText>{t('Security keys')}</ListItemText>
    </MenuItem>
  );
};

export default SecurityKeysMenuItem;
