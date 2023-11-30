import { FC } from 'react';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { AccountMenuItemProps } from '..';
import { AdminPanelSettings } from '@mui/icons-material';
import useAuthData from '@/hooks/useAuthData';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const UsersMenuItem: FC<AccountMenuItemProps> = ({ closeMenu }) => {
  const { t } = useTranslation();
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
      <ListItemText>{t('Users')}</ListItemText>
    </MenuItem>
  );
};

export default UsersMenuItem;
