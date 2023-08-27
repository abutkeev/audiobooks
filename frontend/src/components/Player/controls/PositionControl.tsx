import { useContext } from 'react';
import { PlayerStateContext, changePosition } from '../usePlayerState';
import { Stack, Typography, Slider } from '@mui/material';

const formatTime = (time: number) => {
  if (time < 0) return;
  const hours = Math.floor(time / (60 * 60));
  const minutes = Math.floor((time % (60 * 60)) / 60);
  const seconds = Math.floor(time % 60);
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  if (hours === 0) return `${formattedMinutes}:${formattedSeconds}`;
  return `${hours}:${formattedMinutes}:${formattedSeconds}`;
};

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
