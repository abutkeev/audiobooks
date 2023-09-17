import { useState } from 'react';
import { AccountCircle, Logout, Person } from '@mui/icons-material';
import { Badge, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import useAuthData from '../../hooks/useAuthData';
import { useAppDispatch } from '../../store';
import { setAuthToken } from '../../store/features/auth';
import useWebSocket from '../../hooks/useWebSocket';

const AccountMenu: React.FC = () => {
  const [menuAhchor, setMenuAnchor] = useState<HTMLElement>();
  const { login } = useAuthData() || {};
  const connected = useWebSocket();
  const dispatch = useAppDispatch();

  const closeMenu = () => setMenuAnchor(undefined);

  const handleLogout = () => {
    dispatch(setAuthToken(''));
    closeMenu();
  };

  if (!login) return;

  return (
    <>
      <IconButton color='inherit' onClick={({ currentTarget }) => setMenuAnchor(currentTarget)}>
        <Badge variant='dot' color={connected ? 'success' : 'error'}>
          <AccountCircle />
        </Badge>
      </IconButton>
      <Menu anchorEl={menuAhchor} open={!!menuAhchor} onClose={closeMenu}>
        <MenuItem divider>
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText>Login: {login}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default AccountMenu;
