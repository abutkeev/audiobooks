import { useState } from 'react';
import { AdminPanelSettings } from '@mui/icons-material';
import { Menu } from '@mui/material';
import useAuthData from '@/hooks/useAuthData';
import UsersMenuItem from './UsersMenuItem';
import ChatsMenuItem from './ChatsMenuItem';
import AppbarMenuButton from '../app-bar/AppbarMenuButton';

export interface AdminMenuItemProps {
  closeMenu(): void;
}

export interface AdminMenuDialogItemProps extends AdminMenuItemProps {
  setShowDialog(v: boolean): void;
}

const AdminMenu: React.FC = () => {
  const [menuAhchor, setMenuAnchor] = useState<HTMLElement>();
  const { admin } = useAuthData() || {};

  const closeMenu = () => setMenuAnchor(undefined);

  if (!admin) return null;

  return (
    <>
      <AppbarMenuButton menuAhchor={menuAhchor} setMenuAnchor={setMenuAnchor}>
        <AdminPanelSettings />
      </AppbarMenuButton>
      <Menu anchorEl={menuAhchor} open={!!menuAhchor} onClose={closeMenu} sx={{ mt: 1 }}>
        <UsersMenuItem closeMenu={closeMenu} />
        <ChatsMenuItem closeMenu={closeMenu} />
      </Menu>
    </>
  );
};

export default AdminMenu;
