import { Paper, Typography } from '@mui/material';

interface ChapterProps {
  title: string;
  current?: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const Chapter: React.FC<ChapterProps> = ({ title, current, onClick }) => {
  return (
    <Paper
      square
      sx={theme => ({ p: 1, backgroundColor: current ? theme.palette.primary.dark : undefined, cursor: 'pointer' })}
      onClick={onClick}
    >
      <Typography flexGrow={1}>{title}</Typography>
    </Paper>
  );
};

export default Chapter;
