import { FC } from 'react';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { AccountMenuItemProps } from '..';
import { Chat } from '@mui/icons-material';
import useAuthData from '../../../hooks/useAuthData';
import { useNavigate } from 'react-router-dom';

const ChatsMenuItem: FC<AccountMenuItemProps> = ({ closeMenu }) => {
  const { admin } = useAuthData()!;
  const navigate = useNavigate();

  const handleNavigateToChatsPage = () => {
    navigate('/chats');
    closeMenu();
  };

  if (!admin) return null;

  return (
    <MenuItem divider onClick={handleNavigateToChatsPage}>
      <ListItemIcon>
        <Chat />
      </ListItemIcon>
      <ListItemText>Chats</ListItemText>
    </MenuItem>
  );
};

export default ChatsMenuItem;
