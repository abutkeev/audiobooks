import { Grid, Paper } from '@mui/material';
import React from 'react';
import VolumeControl from './VolumeControl';
import PositionControl from './PositionControl';
import PlayerControlPanel from './PlayerControlPanel';
import SleepControl from './SleepControl';

const Controls: React.FC = () => {
  return (
    <Paper square sx={{ p: 1 }}>
      <PlayerControlPanel />
      <Grid container p={1} alignItems='center'>
        <Grid item xs={4}>
          <VolumeControl />
        </Grid>
        <Grid item xs={8} display='flex' justifyContent='flex-end'>
          <SleepControl />
        </Grid>
      </Grid>
      <PositionControl />
    </Paper>
  );
};

export default Controls;
