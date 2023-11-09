import { FC } from 'react';
import { Key } from '@mui/icons-material';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { AccountMenuDialogItemProps } from '..';

const ChangePasswordMenuItem: FC<AccountMenuDialogItemProps> = ({ setShowDialog, closeMenu }) => {
  const handleShowDialog = () => {
    setShowDialog(true);
    closeMenu();
  };

  return (
    <MenuItem onClick={handleShowDialog}>
      <ListItemIcon>
        <Key />
      </ListItemIcon>
      <ListItemText>Change password</ListItemText>
    </MenuItem>
  );
};

export default ChangePasswordMenuItem;
