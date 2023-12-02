import { FC } from 'react';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { AdminMenuItemProps } from '.';
import { Chat } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ChatsMenuItem: FC<AdminMenuItemProps> = ({ closeMenu }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleNavigateToChatsPage = () => {
    navigate('/chats');
    closeMenu();
  };

  return (
    <MenuItem onClick={handleNavigateToChatsPage}>
      <ListItemIcon>
        <Chat />
      </ListItemIcon>
      <ListItemText>{t('Chats')}</ListItemText>
    </MenuItem>
  );
};

export default ChatsMenuItem;
