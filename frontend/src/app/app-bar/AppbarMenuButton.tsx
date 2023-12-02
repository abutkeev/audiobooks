import { FC, PropsWithChildren } from 'react';
import { Box, IconButton, useTheme } from '@mui/material';

interface AppbarMenuButtonProps {
  menuAhchor?: HTMLElement;
  setMenuAnchor(v?: HTMLElement): void;
}

const AppbarMenuButton: FC<PropsWithChildren<AppbarMenuButtonProps>> = ({ menuAhchor, setMenuAnchor, children }) => {
  const { palette } = useTheme();

  return (
    <Box mx={1} sx={{ background: menuAhchor ? palette.primary.dark : undefined }}>
      <IconButton
        disableFocusRipple
        disableTouchRipple
        color='inherit'
        onClick={({ currentTarget }) => setMenuAnchor(currentTarget)}
      >
        {children}
      </IconButton>
    </Box>
  );
};

export default AppbarMenuButton;
