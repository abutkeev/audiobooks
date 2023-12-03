import { useState } from 'react';
import { Stack, Typography, Slider, Skeleton } from '@mui/material';
import formatTime from '@/utils/formatTime';
import { useAppDispatch, useAppSelector } from '@/store';
import { changePosition } from '@/store/features/player';

const PositionControl: React.FC = () => {
  const { position, duration } = useAppSelector(({ player: { state } }) => state);
  const dispatch = useAppDispatch();

  const handlePositionChange = (newPosition: number) => dispatch(changePosition(newPosition));
  const [showRemaining, setShowRemaining] = useState(false);

  return (
    <Stack spacing={2} alignItems='center' direction='row' mx={1}>
      {duration ? (
        <>
          <Typography sx={{ cursor: 'default' }}>{formatTime(position)}</Typography>
          <Slider
            value={position}
            onChange={(_, position) => typeof position === 'number' && handlePositionChange(position)}
            max={duration}
            valueLabelDisplay='auto'
            valueLabelFormat={formatTime}
          />
          <Typography sx={{ cursor: 'pointer' }} onClick={() => setShowRemaining(!showRemaining)}>
            {showRemaining ? `-${formatTime(duration - position)}` : formatTime(duration)}
          </Typography>
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
