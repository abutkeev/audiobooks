import { FC } from 'react';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { AdminMenuItemProps } from '.';
import { LibraryBooks } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SeriesMenuItem: FC<AdminMenuItemProps> = ({ closeMenu }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleNavigateToChatsPage = () => {
    navigate('/series');
    closeMenu();
  };

  return (
    <MenuItem onClick={handleNavigateToChatsPage}>
      <ListItemIcon>
        <LibraryBooks />
      </ListItemIcon>
      <ListItemText>{t('Series')}</ListItemText>
    </MenuItem>
  );
};

export default SeriesMenuItem;
