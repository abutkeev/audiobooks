import { FC } from 'react';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { AccountMenuItemProps } from '..';
import { AdminPanelSettings } from '@mui/icons-material';
import useAuthData from '../../../hooks/useAuthData';
import { useNavigate } from 'react-router-dom';

const UsersMenuItem: FC<AccountMenuItemProps> = ({ closeMenu }) => {
  const { admin } = useAuthData()!;
  const navigate = useNavigate();

  const handleNavigateToUsersPage = () => {
    navigate('/users');
    closeMenu();
  };

  if (!admin) return null;

  return (
    <MenuItem onClick={handleNavigateToUsersPage}>
      <ListItemIcon>
        <AdminPanelSettings />
      </ListItemIcon>
      <ListItemText>Users</ListItemText>
    </MenuItem>
  );
};

export default UsersMenuItem;
