import { useContext } from 'react';
import { PlayerStateContext, changePosition } from '../usePlayerState';
import { Stack, Typography, Slider } from '@mui/material';
import formatTime from '../../../utils/formatTime';

const PositionControl: React.FC = () => {
  const {
    state: { position, duration },
    dispatch,
  } = useContext(PlayerStateContext);
  const handlePositionChange = (newPosition: number) => dispatch(changePosition(newPosition));

  return (
    !!duration && (
      <Stack spacing={2} direction='row' mx={1}>
        <Typography>{formatTime(position)}</Typography>
        <Slider
          value={position}
          onChange={(_, position) => typeof position === 'number' && handlePositionChange(position)}
          max={duration}
          valueLabelDisplay='auto'
          valueLabelFormat={formatTime}
        />
        <Typography>{formatTime(duration)}</Typography>
      </Stack>
    )
  );
};

export default PositionControl;
