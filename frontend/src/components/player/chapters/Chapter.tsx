import { Paper, Typography } from '@mui/material';
import { ChapterCacheState } from '../state/useCache';
import ChapterCacheIcon from './ChapterCacheIcon';

interface ChapterProps {
  title: string;
  current?: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  cacheState?: ChapterCacheState;
}

const Chapter: React.FC<ChapterProps> = ({ title, current, onClick, cacheState }) => {
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
      <ChapterCacheIcon cacheState={cacheState} />
    </Paper>
  );
};

export default Chapter;
