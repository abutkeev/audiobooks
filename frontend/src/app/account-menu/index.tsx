import { useEffect, useState } from 'react';
import { AccountCircle, AdminPanelSettings, Key, Logout, People, Person } from '@mui/icons-material';
import { Badge, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import useAuthData from '../../hooks/useAuthData';
import { useAppDispatch } from '../../store';
import { setAuthToken } from '../../store/features/auth';
import useWebSocket from '../../hooks/useWebSocket';
import SecurityKeysDialog from './security-keys-dialog';
import { useNavigate } from 'react-router-dom';
import { useLazyFriendsGetIncomingRequestsQuery } from '../../api/api';
import FriendsBage from '../../components/FriendsBage';

const AccountMenu: React.FC = () => {
  const [menuAhchor, setMenuAnchor] = useState<HTMLElement>();
  const [friendsRequests, setFriendsRequests] = useState(0);
  const { login, admin, enabled } = useAuthData() || {};
  const connected = useWebSocket();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showSecurityKeysDialog, setShowSecurityKeysDialog] = useState(false);
  const [getFriendsRequests, { status, isFetching }] = useLazyFriendsGetIncomingRequestsQuery();

  useEffect(() => {
    if (!enabled || !['uninitialized', 'fulfilled'].includes(status)) return;

    try {
      getFriendsRequests(undefined, true)
        .unwrap()
        .then(result => {
          setFriendsRequests(result.length);
        });
    } catch {}
  }, [enabled, status, isFetching]);

  const closeMenu = () => setMenuAnchor(undefined);

  const handleShowSecurityKeysDialog = () => {
    setShowSecurityKeysDialog(true);
    closeMenu();
  };

  const handleNavigateToUsersPage = () => {
    navigate('/users');
    closeMenu();
  };

  const handleNavigateToFriendsPage = () => {
    navigate('/friends');
    closeMenu();
  };

  const handleLogout = () => {
    dispatch(setAuthToken(''));
    closeMenu();
  };

  if (!login) return;

  return (
    <>
      <IconButton color='inherit' onClick={({ currentTarget }) => setMenuAnchor(currentTarget)}>
        <Badge
          variant={friendsRequests ? 'standard' : 'dot'}
          badgeContent={friendsRequests || undefined}
          color={connected ? 'success' : 'error'}
        >
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
        {admin && (
          <MenuItem divider onClick={handleNavigateToUsersPage}>
            <ListItemIcon>
              <AdminPanelSettings />
            </ListItemIcon>
            <ListItemText>Users</ListItemText>
          </MenuItem>
        )}
        {enabled && (
          <MenuItem divider onClick={handleNavigateToFriendsPage}>
            <ListItemIcon>
              <People />
            </ListItemIcon>
            <ListItemText>Friends</ListItemText>
            <FriendsBage friendsRequests={friendsRequests} />
          </MenuItem>
        )}
        <MenuItem onClick={handleShowSecurityKeysDialog}>
          <ListItemIcon>
            <Key />
          </ListItemIcon>
          <ListItemText>Security keys</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
      <SecurityKeysDialog open={showSecurityKeysDialog} close={() => setShowSecurityKeysDialog(false)} />
    </>
  );
};

export default AccountMenu;
