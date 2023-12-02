import { FC } from 'react';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { AdminMenuItemProps } from '.';
import { People } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const UsersMenuItem: FC<AdminMenuItemProps> = ({ closeMenu }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleNavigateToUsersPage = () => {
    navigate('/users');
    closeMenu();
  };

  return (
    <MenuItem onClick={handleNavigateToUsersPage}>
      <ListItemIcon>
        <People />
      </ListItemIcon>
      <ListItemText>{t('Users')}</ListItemText>
    </MenuItem>
  );
};

export default UsersMenuItem;
