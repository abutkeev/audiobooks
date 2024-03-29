import { PropsWithChildren, createContext, forwardRef, useState } from 'react';
import { Box, SpeedDial, SpeedDialIcon, SpeedDialProps, useTheme } from '@mui/material';

export const CustomSpeedDialContext = createContext({ closeSpeedDial: () => {} });

const CustomSpeedDial = forwardRef<HTMLDivElement, PropsWithChildren<{ bottom?: number }>>(
  ({ bottom, children }, ref) => {
    const { spacing } = useTheme();
    const [showMenu, setShowMenu] = useState(false);

    const handleSpeedDialOpen: SpeedDialProps['onOpen'] = (_, reason) => {
      if (reason === 'focus') return;
      setShowMenu(true);
    };

    const handleSpeedDialClose: SpeedDialProps['onClose'] = () => setShowMenu(false);

    return (
      <CustomSpeedDialContext.Provider value={{ closeSpeedDial: () => setShowMenu(false) }}>
        <SpeedDial
          ref={ref}
          ariaLabel='Add items'
          sx={{ position: 'fixed', bottom: bottom || spacing(2), right: spacing(2) }}
          icon={<SpeedDialIcon />}
          open={showMenu}
          onOpen={handleSpeedDialOpen}
          onClose={handleSpeedDialClose}
          FabProps={{ sx: { alignSelf: 'flex-end' } }}
        >
          {children}
        </SpeedDial>
        {/* Add some space in bottom to scroll in small screens */}
        <Box sx={{ height: { xs: spacing(8), lg: 0 } }} />
      </CustomSpeedDialContext.Provider>
    );
  }
);

export default CustomSpeedDial;
