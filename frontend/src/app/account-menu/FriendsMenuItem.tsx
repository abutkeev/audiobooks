import { FC } from 'react';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { AccountMenuItemProps } from '.';
import { People } from '@mui/icons-material';
import useAuthData from '@/hooks/useAuthData';
import FriendsBage from '@/components/FriendsBage';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface FriendsMenuItemProps extends AccountMenuItemProps {
  friendsRequests: number;
}

const FriendsMenuItem: FC<FriendsMenuItemProps> = ({ friendsRequests, closeMenu }) => {
  const { t } = useTranslation();
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
      <ListItemText>{t('Friends')}</ListItemText>
      <FriendsBage friendsRequests={friendsRequests} />
    </MenuItem>
  );
};

export default FriendsMenuItem;
