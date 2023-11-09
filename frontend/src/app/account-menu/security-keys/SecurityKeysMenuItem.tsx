import { FC } from 'react';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { AccountMenuDialogItemProps } from '..';
import { Fingerprint } from '@mui/icons-material';

const SecurityKeysMenuItem: FC<AccountMenuDialogItemProps> = ({ setShowDialog, closeMenu }) => {
  const handleShowDialog = () => {
    setShowDialog(true);
    closeMenu();
  };

  return (
    <MenuItem onClick={handleShowDialog}>
      <ListItemIcon>
        <Fingerprint />
      </ListItemIcon>
      <ListItemText>Security keys</ListItemText>
    </MenuItem>
  );
};

export default SecurityKeysMenuItem;
