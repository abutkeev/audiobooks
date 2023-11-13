import { FC } from 'react';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { AccountMenuItemProps } from '..';
import { Chat } from '@mui/icons-material';
import useAuthData from '../../../hooks/useAuthData';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ChatsMenuItem: FC<AccountMenuItemProps> = ({ closeMenu }) => {
  const { t } = useTranslation();
  const { admin } = useAuthData()!;
  const navigate = useNavigate();

  const handleNavigateToChatsPage = () => {
    navigate('/chats');
    closeMenu();
  };

  if (!admin) return null;

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
