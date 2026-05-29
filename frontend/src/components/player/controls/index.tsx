import { Grid, Paper } from '@mui/material';
import React from 'react';
import VolumeControl from './VolumeControl';
import PositionControl from './PositionControl';
import PlayerControlPanel from './PlayerControlPanel';
import SleepControl from './SleepControl';
import Settings from './Settings';
import CopyPosition from './CopyPosition';
import Bookmarks from './Bookmarks';

const Controls: React.FC = () => {
  return (
    <Paper square sx={{ p: 1 }}>
      <PlayerControlPanel />
      <Grid container sx={{ p: 1, alignItems: 'center' }}>
        <Grid size={{ sm: 6, md: 4 }} sx={{ display: { xs: 'none', sm: 'block' } }}>
          <VolumeControl />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 8 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Bookmarks />
          <CopyPosition />
          <SleepControl />
          <Settings />
        </Grid>
      </Grid>
      <PositionControl />
    </Paper>
  );
};

export default Controls;
