import { FC } from 'react';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { AccountMenuItemProps } from '.';
import { Logout } from '@mui/icons-material';
import { useAppDispatch } from '@/store';
import { useTranslation } from 'react-i18next';
import { connect } from '@/store/features/websocket';

const ReconnectMenuItem: FC<AccountMenuItemProps> = ({ closeMenu }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleReconnect = () => {
    dispatch(connect());
    closeMenu();
  };

  return (
    <MenuItem onClick={handleReconnect}>
      <ListItemIcon>
        <Logout />
      </ListItemIcon>
      <ListItemText>{t('Reconnect')}</ListItemText>
    </MenuItem>
  );
};

export default ReconnectMenuItem;
