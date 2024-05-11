import { useEffect, useState } from 'react';
import { AccountCircle, Settings } from '@mui/icons-material';
import { Badge, IconButton, Menu } from '@mui/material';
import useAuthData from '@/hooks/useAuthData';
import useWebSocket from '@/hooks/useWebSocket';
import SecurityKeysDialog from './security-keys/SecurityKeysDialog';
import { useLazyFriendsGetIncomingRequestsQuery } from '@/api/api';
import LinkedAccountsDialog from './linked-accounts/LinkedAccountsDialog';
import ChangePasswordDialog from './change-password/ChangePasswordDialog';
import ProfileMenuItem from './profile/ProfileMenuItem';
import ProfileDialog from './profile/ProfileDialog';
import ChangePasswordMenuItem from './change-password/ChangePasswordMenuItem';
import LinkedAccountsMenuItem from './linked-accounts/LinkedAccountsMenuItem';
import SecurityKeysMenuItem from './security-keys/SecurityKeysMenuItem';
import LogoutMenuItem from './LogoutMenuItem';
import FriendsMenuItem from './FriendsMenuItem';
import SettingsMenuItem from './settings/SettingsMenuItem';
import SettingsDialog from './settings/SettingsDialog';
import AppbarMenuButton from '../app-bar/AppbarMenuButton';
import ReconnectMenuItem from './ReconnectMenuItem';

export interface AccountMenuItemProps {
  closeMenu(): void;
}

export interface AccountMenuDialogItemProps extends AccountMenuItemProps {
  setShowDialog(v: boolean): void;
}

const AccountMenu: React.FC = () => {
  const [menuAhchor, setMenuAnchor] = useState<HTMLElement>();
  const [friendsRequests, setFriendsRequests] = useState(0);
  const { login, enabled } = useAuthData() || {};
  const connected = useWebSocket();
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showSecurityKeysDialog, setShowSecurityKeysDialog] = useState(false);
  const [showLinkedAccountsDialog, setShowLinkedAccountsDialog] = useState(false);
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [getFriendsRequests, { status }] = useLazyFriendsGetIncomingRequestsQuery();

  useEffect(() => {
    if (!enabled || !['uninitialized', 'fulfilled'].includes(status)) return;

    try {
      getFriendsRequests(undefined, true)
        .unwrap()
        .then(result => {
          setFriendsRequests(result.length);
        });
    } catch {
      // ignore errors
    }
  }, [enabled, status, getFriendsRequests]);

  const closeMenu = () => setMenuAnchor(undefined);

  if (!login)
    return (
      <>
        <IconButton color='inherit' onClick={() => setShowSettingsDialog(true)}>
          <Settings />
        </IconButton>
        <SettingsDialog open={showSettingsDialog} close={() => setShowSettingsDialog(false)} />
      </>
    );

  return (
    <>
      <AppbarMenuButton menuAhchor={menuAhchor} setMenuAnchor={setMenuAnchor}>
        <Badge
          variant={friendsRequests ? 'standard' : 'dot'}
          badgeContent={friendsRequests || undefined}
          color={connected ? 'success' : 'error'}
        >
          <AccountCircle />
        </Badge>
      </AppbarMenuButton>
      <Menu anchorEl={menuAhchor} open={!!menuAhchor} onClose={closeMenu} sx={{ mt: 1 }}>
        {!connected && <ReconnectMenuItem closeMenu={closeMenu} />}
        <ProfileMenuItem setShowDialog={setShowProfileDialog} closeMenu={closeMenu} />
        <SettingsMenuItem setShowDialog={setShowSettingsDialog} closeMenu={closeMenu} />
        <ChangePasswordMenuItem setShowDialog={setShowChangePasswordDialog} closeMenu={closeMenu} />
        <FriendsMenuItem friendsRequests={friendsRequests} closeMenu={closeMenu} />
        <LinkedAccountsMenuItem setShowDialog={setShowLinkedAccountsDialog} closeMenu={closeMenu} />
        <SecurityKeysMenuItem setShowDialog={setShowSecurityKeysDialog} closeMenu={closeMenu} />
        <LogoutMenuItem closeMenu={closeMenu} />
      </Menu>
      <ProfileDialog open={showProfileDialog} close={() => setShowProfileDialog(false)} />
      <SettingsDialog open={showSettingsDialog} close={() => setShowSettingsDialog(false)} />
      <SecurityKeysDialog open={showSecurityKeysDialog} close={() => setShowSecurityKeysDialog(false)} />
      <LinkedAccountsDialog open={showLinkedAccountsDialog} close={() => setShowLinkedAccountsDialog(false)} />
      <ChangePasswordDialog open={showChangePasswordDialog} close={() => setShowChangePasswordDialog(false)} />
    </>
  );
};

export default AccountMenu;
