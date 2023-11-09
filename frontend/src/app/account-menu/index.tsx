import { useEffect, useState } from 'react';
import { AccountCircle, AdminPanelSettings, Chat, Logout, People } from '@mui/icons-material';
import { Badge, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import useAuthData from '../../hooks/useAuthData';
import { useAppDispatch } from '../../store';
import { setAuthToken } from '../../store/features/auth';
import useWebSocket from '../../hooks/useWebSocket';
import SecurityKeysDialog from './security-keys/SecurityKeysDialog';
import { useNavigate } from 'react-router-dom';
import { useLazyFriendsGetIncomingRequestsQuery } from '../../api/api';
import FriendsBage from '../../components/FriendsBage';
import LinkedAccountsDialog from './linked-accounts/LinkedAccountsDialog';
import ChangePasswordDialog from './change-password/ChangePasswordDialog';
import ProfileMenuItem from './profile/ProfileMenuItem';
import ProfileDialog from './profile/ProfileDialog';
import ChangePasswordMenuItem from './change-password/ChangePasswordMenuItem';
import LinkedAccountsMenuItem from './linked-accounts/LinkedAccountsMenuItem';
import SecurityKeysMenuItem from './security-keys/SecurityKeysMenuItem';

export interface AccountMenuItemProps {
  closeMenu(): void;
}

export interface AccountMenuDialogItemProps extends AccountMenuItemProps {
  setShowDialog(v: boolean): void;
}

const AccountMenu: React.FC = () => {
  const [menuAhchor, setMenuAnchor] = useState<HTMLElement>();
  const [friendsRequests, setFriendsRequests] = useState(0);
  const { login, admin, enabled } = useAuthData() || {};
  const connected = useWebSocket();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showSecurityKeysDialog, setShowSecurityKeysDialog] = useState(false);
  const [showLinkedAccountsDialog, setShowLinkedAccountsDialog] = useState(false);
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
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

  const handleNavigateToUsersPage = () => {
    navigate('/users');
    closeMenu();
  };

  const handleNavigateToChatsPage = () => {
    navigate('/chats');
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
        <ProfileMenuItem setShowDialog={setShowProfileDialog} closeMenu={closeMenu} />
        <ChangePasswordMenuItem setShowDialog={setShowChangePasswordDialog} closeMenu={closeMenu} />
        {admin && (
          <MenuItem divider onClick={handleNavigateToUsersPage}>
            <ListItemIcon>
              <AdminPanelSettings />
            </ListItemIcon>
            <ListItemText>Users</ListItemText>
          </MenuItem>
        )}
        {admin && (
          <MenuItem divider onClick={handleNavigateToChatsPage}>
            <ListItemIcon>
              <Chat />
            </ListItemIcon>
            <ListItemText>Chats</ListItemText>
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
        <LinkedAccountsMenuItem setShowDialog={setShowLinkedAccountsDialog} closeMenu={closeMenu} />
        <SecurityKeysMenuItem setShowDialog={setShowSecurityKeysDialog} closeMenu={closeMenu} />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
      <ProfileDialog open={showProfileDialog} close={() => setShowProfileDialog(false)} />
      <SecurityKeysDialog open={showSecurityKeysDialog} close={() => setShowSecurityKeysDialog(false)} />
      <LinkedAccountsDialog open={showLinkedAccountsDialog} close={() => setShowLinkedAccountsDialog(false)} />
      <ChangePasswordDialog open={showChangePasswordDialog} close={() => setShowChangePasswordDialog(false)} />
    </>
  );
};

export default AccountMenu;
