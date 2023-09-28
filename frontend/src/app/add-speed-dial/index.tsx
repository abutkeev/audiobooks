import { useState } from 'react';
import { Box, SpeedDial, SpeedDialAction, SpeedDialIcon, SpeedDialProps, useTheme } from '@mui/material';
import useAuthData from '../../hooks/useAuthData';
import { Edit, LibraryBooks, Mic } from '@mui/icons-material';
import AddReaderDialog from './AddPersonDialog';
import AddSeriesDialog from './AddSeriesDialog';

const AddSpeedDial: React.FC = () => {
  const { admin } = useAuthData() || {};
  const { spacing } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [addPersonDialogType, setAddPersonDialogType] = useState<'author' | 'reader'>();
  const [showAddSeriesDialog, setShowAddSeriesDialog] = useState(false);

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
          icon={<Edit />}
          tooltipTitle='Add author'
          tooltipOpen
          onClick={() => setAddPersonDialogType('author')}
        />
        <SpeedDialAction
          icon={<Mic />}
          tooltipTitle='Add reader'
          tooltipOpen
          onClick={() => setAddPersonDialogType('reader')}
        />
        <SpeedDialAction
          icon={<LibraryBooks />}
          tooltipTitle='Add series'
          tooltipOpen
          onClick={() => setShowAddSeriesDialog(true)}
        />
      </SpeedDial>
      <AddReaderDialog type={addPersonDialogType} close={() => setAddPersonDialogType(undefined)} />
      <AddSeriesDialog open={showAddSeriesDialog} close={() => setShowAddSeriesDialog(false)} />
      {/* Add some space in bottom to scroll in small screens */}
      <Box sx={{ height: { xs: spacing(4), lg: 0 } }} />
    </>
  );
};

export default AddSpeedDial;
