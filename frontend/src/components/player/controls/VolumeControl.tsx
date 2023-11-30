import { VolumeDown, VolumeUp } from '@mui/icons-material';
import { Stack, Slider } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store';
import { changeVolume } from '@/store/features/player';

const VolumeControl: React.FC = () => {
  const { volume } = useAppSelector(({ player: { state } }) => state);
  const dispatch = useAppDispatch();

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
