import { FC } from 'react';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { AccountMenuItemProps } from '.';
import { Logout } from '@mui/icons-material';
import { useAppDispatch } from '../../store';
import { setAuthToken } from '../../store/features/auth';
import { useTranslation } from 'react-i18next';

const LogoutMenuItem: FC<AccountMenuItemProps> = ({ closeMenu }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(setAuthToken(''));
    closeMenu();
  };

  return (
    <MenuItem onClick={handleLogout}>
      <ListItemIcon>
        <Logout />
      </ListItemIcon>
      <ListItemText>{t('Logout')}</ListItemText>
    </MenuItem>
  );
};

export default LogoutMenuItem;
