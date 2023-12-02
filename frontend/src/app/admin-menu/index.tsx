import { useState } from 'react';
import { AdminPanelSettings } from '@mui/icons-material';
import { IconButton, Menu } from '@mui/material';
import useAuthData from '@/hooks/useAuthData';
import UsersMenuItem from './UsersMenuItem';
import ChatsMenuItem from './ChatsMenuItem';

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
      <IconButton color='inherit' onClick={({ currentTarget }) => setMenuAnchor(currentTarget)}>
        <AdminPanelSettings />
      </IconButton>
      <Menu anchorEl={menuAhchor} open={!!menuAhchor} onClose={closeMenu}>
        <UsersMenuItem closeMenu={closeMenu} />
        <ChatsMenuItem closeMenu={closeMenu} />
      </Menu>
    </>
  );
};

export default AdminMenu;
