import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Paper, Typography } from '@mui/material';
import { usePositionGetBookQuery } from '../api/api';
import formatTime from '../utils/formatTime';
import { useAppDispatch, useAppSelector } from '../store';
import { updateBookState } from '../store/features/player';

interface OtherPlayersPositionProps {
  bookId: string;
  chapters: { title: string }[];
}

const OtherPlayersPosition: React.FC<OtherPlayersPositionProps> = ({ bookId, chapters }) => {
  const { data = [] } = usePositionGetBookQuery({ bookId });
  const { instanceId } = useAppSelector(({ websocket }) => websocket);
  const dispatch = useAppDispatch();

  const positions = data.filter(entry => entry.instanceId !== instanceId);
  if (positions.length === 0) return;

  const getPlayerStateChangeHandler = (currentChapter: number, position: number) => () => {
    dispatch(updateBookState({ currentChapter, position, bookId }));
  };

  return (
    <Accordion square>
      <AccordionSummary expandIcon={<ExpandMore />}>Other players position</AccordionSummary>
      <AccordionDetails>
        {positions.map(({ instanceId, currentChapter, position, updated }) => {
          const chapterTitle = chapters[currentChapter].title;
          const chapterNumber = currentChapter + 1;
          const titleIsChapterNumber = +chapterTitle === chapterNumber;
          const updatedToday = new Date().toDateString() === new Date(updated).toDateString();
          const updatedString = Intl.DateTimeFormat(undefined, {
            dateStyle: updatedToday ? undefined : 'short',
            timeStyle: 'medium',
          }).format(new Date(updated));

          return (
            <Paper
              square
              key={instanceId}
              sx={{
                p: 1,
                cursor: 'pointer',
                display: 'flex',
                flexWrap: 'nowrap',
              }}
              onClick={getPlayerStateChangeHandler(currentChapter, position)}
            >
              <Typography>
                Current chapter {chapterNumber} {!titleIsChapterNumber && `(${chapterTitle})`}, position:{' '}
                {formatTime(position)}, updated: {updatedString}
              </Typography>
            </Paper>
          );
        })}
      </AccordionDetails>
    </Accordion>
  );
};

export default OtherPlayersPosition;
