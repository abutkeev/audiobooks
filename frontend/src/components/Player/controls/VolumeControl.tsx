import { VolumeDown, VolumeUp } from '@mui/icons-material';
import { Stack, Slider } from '@mui/material';

interface VolumeControlProps {
  volume?: number;
  handleVolumeChange(newLevel: number): void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ volume, handleVolumeChange }) => {
  return (
    volume && (
      <Stack direction='row' spacing={2} alignItems='center'>
        <VolumeDown color='primary' />
        <Slider
          value={volume}
          onChange={(_, newLevel) => typeof newLevel === 'number' && handleVolumeChange(newLevel)}
        />
        <VolumeUp color='primary' />
      </Stack>
    )
  );
};

export default VolumeControl;
