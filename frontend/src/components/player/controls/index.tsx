import { Grid, Hidden, Paper } from '@mui/material';
import React from 'react';
import VolumeControl from './VolumeControl';
import PositionControl from './PositionControl';
import PlayerControlPanel from './PlayerControlPanel';
import SleepControl from './SleepControl';
import Settings from './Settings';
import CopyPosition from './CopyPosition';

const Controls: React.FC = () => {
  return (
    <Paper square sx={{ p: 1 }}>
      <PlayerControlPanel />
      <Grid container p={1} alignItems='center'>
        <Hidden smDown>
          <Grid item md={4}>
            <VolumeControl />
          </Grid>
        </Hidden>
        <Grid item xs={12} md={8} display='flex' justifyContent='flex-end'>
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
