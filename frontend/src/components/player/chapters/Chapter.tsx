import { Paper, Typography } from '@mui/material';
import ChapterCacheIcon from './ChapterCacheIcon';
import { MediaCacheEntryState } from '@/store/features/media-cache';
import formatTime from '@/utils/formatTime';

interface ChapterProps {
  title: string;
  duration?: number;
  current?: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  cacheState?: MediaCacheEntryState;
}

const Chapter: React.FC<ChapterProps> = ({ title, duration, current, onClick, cacheState }) => {
  return (
    <Paper
      square
      sx={theme => ({
        p: 1,
        backgroundColor: current ? theme.palette.primary.dark : undefined,
        cursor: 'pointer',
        display: 'flex',
        flexWrap: 'nowrap',
      })}
      onClick={onClick}
    >
      <Typography flexGrow={1}>{title}</Typography>
      {duration && <Typography>{formatTime(duration)}</Typography>}
      <ChapterCacheIcon cacheState={cacheState} />
    </Paper>
  );
};

export default Chapter;
