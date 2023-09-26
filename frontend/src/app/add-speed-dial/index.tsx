import { useState } from 'react';
import { Box, SpeedDial, SpeedDialAction, SpeedDialIcon, SpeedDialProps, useTheme } from '@mui/material';
import useAuthData from '../../hooks/useAuthData';
import { Mic } from '@mui/icons-material';
import AddReaderDialog from './AddReaderDialog';

const AddSpeedDial: React.FC = () => {
  const { admin } = useAuthData() || {};
  const { spacing } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [showAddReaderDialog, setShowAddReaderDialog] = useState(false);

  const handleSpeedDialOpen: SpeedDialProps['onOpen'] = (_, reason) => {
    if (reason === 'focus') return;
    setShowMenu(true);
  };

  if (!admin) return;

  return (
    <>
      <SpeedDial
        ariaLabel='Add items'
        sx={{ position: 'absolute', bottom: spacing(2), right: spacing(2) }}
        icon={<SpeedDialIcon />}
        open={showMenu}
        onOpen={handleSpeedDialOpen}
        onClose={() => setShowMenu(false)}
      >
        <SpeedDialAction
          icon={<Mic />}
          tooltipTitle='Add reader'
          tooltipOpen
          onClick={() => setShowAddReaderDialog(true)}
        />
      </SpeedDial>
      <AddReaderDialog open={showAddReaderDialog} close={() => setShowAddReaderDialog(false)} />
      {/* Add some space in bottom to scroll in small screens */}
      <Box sx={{ height: { xs: spacing(4), lg: 0 } }} />
    </>
  );
};

export default AddSpeedDial;
