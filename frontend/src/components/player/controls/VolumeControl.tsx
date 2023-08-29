import { VolumeDown, VolumeUp } from '@mui/icons-material';
import { Stack, Slider } from '@mui/material';
import { useContext } from 'react';
import { PlayerStateContext, changeVolume } from '../state/usePlayerState';

const VolumeControl: React.FC = () => {
  const {
    state: { volume },
    dispatch,
  } = useContext(PlayerStateContext);

  return (
    <Stack direction='row' spacing={2} alignItems='center'>
      <VolumeDown color='primary' sx={{ cursor: 'pointer' }} onClick={() => dispatch(changeVolume(0))} />
      <Slider
        value={volume}
        onChange={(_, newLevel) => typeof newLevel === 'number' && dispatch(changeVolume(newLevel))}
      />
      <VolumeUp color='primary' sx={{ cursor: 'pointer' }} onClick={() => dispatch(changeVolume(100))} />
    </Stack>
  );
};

export default VolumeControl;
