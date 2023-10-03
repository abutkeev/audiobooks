import { createContext, useState } from 'react';
import { Box, SpeedDial, SpeedDialIcon, SpeedDialProps, useTheme } from '@mui/material';

export const CustomSpeedDialContext = createContext({ closeSpeedDial: () => {} });

const CustomSpeedDial: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { spacing } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  const handleSpeedDialOpen: SpeedDialProps['onOpen'] = (_, reason) => {
    if (reason === 'focus' || reason === 'mouseEnter') return;
    setShowMenu(true);
  };

  const handleSpeedDialClose: SpeedDialProps['onClose'] = (_, reason) => {
    if (reason === 'mouseLeave') return;
    setShowMenu(false);
  };

  return (
    <CustomSpeedDialContext.Provider value={{ closeSpeedDial: () => setShowMenu(false) }}>
      <SpeedDial
        ariaLabel='Add items'
        sx={{ position: 'fixed', bottom: spacing(2), right: spacing(2) }}
        icon={<SpeedDialIcon />}
        open={showMenu}
        onOpen={handleSpeedDialOpen}
        onClose={handleSpeedDialClose}
      >
        {children}
      </SpeedDial>
      {/* Add some space in bottom to scroll in small screens */}
      <Box sx={{ height: { xs: spacing(8), lg: 0 } }} />
    </CustomSpeedDialContext.Provider>
  );
};

export default CustomSpeedDial;
