import { FC } from 'react';
import { Person } from '@mui/icons-material';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import useAuthData from '../../../hooks/useAuthData';
import { AccountMenuDialogItemProps } from '..';

const ProfileMenuItem: FC<AccountMenuDialogItemProps> = ({ setShowDialog, closeMenu }) => {
  const { login } = useAuthData()!;

  const handleShowDialog = () => {
    setShowDialog(true);
    closeMenu();
  };

  return (
    <MenuItem onClick={handleShowDialog}>
      <ListItemIcon>
        <Person />
      </ListItemIcon>
      <ListItemText>Login: {login}</ListItemText>
    </MenuItem>
  );
};

export default ProfileMenuItem;
