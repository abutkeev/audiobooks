import { FC } from 'react';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { AccountMenuDialogItemProps } from '..';
import { Link } from '@mui/icons-material';

const LinkedAccountsMenuItem: FC<AccountMenuDialogItemProps> = ({ setShowDialog, closeMenu }) => {
  const handleShowDialog = () => {
    setShowDialog(true);
    closeMenu();
  };

  return (
    <MenuItem onClick={handleShowDialog}>
      <ListItemIcon>
        <Link />
      </ListItemIcon>
      <ListItemText>Linked accounts</ListItemText>
    </MenuItem>
  );
};

export default LinkedAccountsMenuItem;
