import { VolumeDown, VolumeUp } from '@mui/icons-material';
import { Stack, Slider } from '@mui/material';
import { useContext } from 'react';
import { PlayerStateContext, changeVolume } from '../usePlayerState';

const VolumeControl: React.FC = () => {
  const {
    state: { volume },
    dispatch,
  } = useContext(PlayerStateContext);
  const handleVolumeChange = (newLevel: number) => dispatch(changeVolume(newLevel));

  return (
    <Stack direction='row' spacing={2} alignItems='center'>
      <VolumeDown color='primary' />
      <Slider value={volume} onChange={(_, newLevel) => typeof newLevel === 'number' && handleVolumeChange(newLevel)} />
      <VolumeUp color='primary' />
    </Stack>
  );
};

export default VolumeControl;
