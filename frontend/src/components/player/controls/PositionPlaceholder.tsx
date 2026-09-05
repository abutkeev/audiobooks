import { Skeleton, Slider, Typography } from '@mui/material';

/** The position row while the duration is unknown: a chapter is loading, or the book has none stored. */
const PositionPlaceholder: React.FC = () => (
  <>
    <Skeleton variant='text'>
      <Typography>00:00</Typography>
    </Skeleton>
    <Slider
      sx={{ flexGrow: 1 }}
      value={0}
      disabled
      slotProps={{ thumb: { style: { display: 'none' } }, track: { style: { display: 'none' } } }}
    />
    <Skeleton>
      <Typography>00:00</Typography>
    </Skeleton>
  </>
);

export default PositionPlaceholder;
