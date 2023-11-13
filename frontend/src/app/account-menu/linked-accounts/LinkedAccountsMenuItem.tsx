import { FC } from 'react';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { AccountMenuDialogItemProps } from '..';
import { Link } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const LinkedAccountsMenuItem: FC<AccountMenuDialogItemProps> = ({ setShowDialog, closeMenu }) => {
  const { t } = useTranslation();
  const handleShowDialog = () => {
    setShowDialog(true);
    closeMenu();
  };

  return (
    <MenuItem onClick={handleShowDialog}>
      <ListItemIcon>
        <Link />
      </ListItemIcon>
      <ListItemText>{t('Linked accounts')}</ListItemText>
    </MenuItem>
  );
};

export default LinkedAccountsMenuItem;
