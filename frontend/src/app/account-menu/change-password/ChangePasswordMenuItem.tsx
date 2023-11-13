import { FC } from 'react';
import { Key } from '@mui/icons-material';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { AccountMenuDialogItemProps } from '..';
import { useTranslation } from 'react-i18next';

const ChangePasswordMenuItem: FC<AccountMenuDialogItemProps> = ({ setShowDialog, closeMenu }) => {
  const { t } = useTranslation();
  const handleShowDialog = () => {
    setShowDialog(true);
    closeMenu();
  };

  return (
    <MenuItem onClick={handleShowDialog}>
      <ListItemIcon>
        <Key />
      </ListItemIcon>
      <ListItemText>{t('Change password')}</ListItemText>
    </MenuItem>
  );
};

export default ChangePasswordMenuItem;
