import { FC } from 'react';
import { Person } from '@mui/icons-material';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import useAuthData from '../../../hooks/useAuthData';
import { AccountMenuDialogItemProps } from '..';

const ProfileMenuItem: FC<AccountMenuDialogItemProps> = ({ setShowDialog, closeMenu }) => {
  const { login, name } = useAuthData()!;

  const handleShowDialog = () => {
    setShowDialog(true);
    closeMenu();
  };

  const formatName = () => {
    if (!name) return login;

    return `${name} (${login})`;
  };

  return (
    <MenuItem onClick={handleShowDialog}>
      <ListItemIcon>
        <Person />
      </ListItemIcon>
      <ListItemText>{formatName()}</ListItemText>
    </MenuItem>
  );
};

export default ProfileMenuItem;
