import { FC, ReactNode } from 'react';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface NavigateMenuItemProps {
  page: string;
  title: string;
  icon: ReactNode;
  closeMenu(): void;
}

const NavigateMenuItem: FC<NavigateMenuItemProps> = ({ page, icon, title, closeMenu }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(page);
    closeMenu();
  };

  return (
    <MenuItem onClick={handleNavigate}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText>{title}</ListItemText>
    </MenuItem>
  );
};

export default NavigateMenuItem;
