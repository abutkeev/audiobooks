import { useContext } from 'react';
import { PlayerStateContext, changePosition } from '../state/usePlayerState';
import { Stack, Typography, Slider, Skeleton } from '@mui/material';
import formatTime from '../../../utils/formatTime';

const PositionControl: React.FC = () => {
  const {
    state: { position, duration },
    dispatch,
  } = useContext(PlayerStateContext);
  const handlePositionChange = (newPosition: number) => dispatch(changePosition(newPosition));

  return (
    <Stack spacing={2} alignItems='center' direction='row' mx={1}>
      {!!duration ? (
        <>
          <Typography sx={{ cursor: 'default' }}>{formatTime(position)}</Typography>
          <Slider
            value={position}
            onChange={(_, position) => typeof position === 'number' && handlePositionChange(position)}
            max={duration}
            valueLabelDisplay='auto'
            valueLabelFormat={formatTime}
          />
          <Typography sx={{ cursor: 'default' }}>{formatTime(duration)}</Typography>
        </>
      ) : (
        <>
          <Skeleton variant='text'>
            <Typography>00:00</Typography>
          </Skeleton>
          <Slider
            value={0}
            disabled
            componentsProps={{ thumb: { style: { display: 'none' } }, track: { style: { display: 'none' } } }}
          />
          <Skeleton>
            <Typography>00:00</Typography>
          </Skeleton>
        </>
      )}
    </Stack>
  );
};

export default PositionControl;
