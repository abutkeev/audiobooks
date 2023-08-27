import { VolumeDown, VolumeUp } from '@mui/icons-material';
import { Stack, Slider } from '@mui/material';
import { useContext, useEffect } from 'react';
import { PlayerStateContext, changeVolume } from '../usePlayerState';

const VolumeControl: React.FC = () => {
  const {
    state: { volume },
    dispatch,
  } = useContext(PlayerStateContext);
  const handleVolumeChange = (newLevel: number) => dispatch(changeVolume(newLevel));
  const handleKeyDown = (e: KeyboardEvent) => {
    const { code } = e;
    const volumeChangeValue = 5;
    const disableDefaultActions = () => {
      e.stopPropagation();
      e.preventDefault();
    };
    switch (code) {
      case 'ArrowUp':
        handleVolumeChange(volume < 100 - volumeChangeValue ? volume + volumeChangeValue : 100);
        disableDefaultActions();
        break;
      case 'ArrowDown':
        handleVolumeChange(volume > volumeChangeValue ? volume - volumeChangeValue : 0);
        disableDefaultActions();
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [volume]);

  return (
    <Stack direction='row' spacing={2} alignItems='center'>
      <VolumeDown color='primary' sx={{ cursor: 'pointer' }} onClick={() => handleVolumeChange(0)} />
      <Slider value={volume} onChange={(_, newLevel) => typeof newLevel === 'number' && handleVolumeChange(newLevel)} />
      <VolumeUp color='primary' sx={{ cursor: 'pointer' }} onClick={() => handleVolumeChange(100)} />
    </Stack>
  );
};

export default VolumeControl;
