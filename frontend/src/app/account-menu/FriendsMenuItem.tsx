import { FC } from 'react';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { AccountMenuItemProps } from '.';
import { People } from '@mui/icons-material';
import useAuthData from '../../hooks/useAuthData';
import FriendsBage from '../../components/FriendsBage';
import { useNavigate } from 'react-router-dom';

interface FriendsMenuItemProps extends AccountMenuItemProps {
  friendsRequests: number;
}

const FriendsMenuItem: FC<FriendsMenuItemProps> = ({ friendsRequests, closeMenu }) => {
  const { enabled } = useAuthData()!;
  const navigate = useNavigate();

  const handleNavigateToFriendsPage = () => {
    navigate('/friends');
    closeMenu();
  };

  if (!enabled) return null;

  return (
    <MenuItem onClick={handleNavigateToFriendsPage}>
      <ListItemIcon>
        <People />
      </ListItemIcon>
      <ListItemText>Friends</ListItemText>
      <FriendsBage friendsRequests={friendsRequests} />
    </MenuItem>
  );
};

export default FriendsMenuItem;
