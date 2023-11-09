import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Paper, SxProps, Typography } from '@mui/material';
import { usePositionGetBookQuery, usePositionGetFriendsBookQuery } from '../api/api';
import formatTime from '../utils/formatTime';
import { useAppDispatch, useAppSelector } from '../store';
import { updateBookState } from '../store/features/player';
import getFriendDisplayName from '../utils/getFriendDisplayName';

interface OtherPlayersPositionProps {
  bookId: string;
  chapters: { title: string }[];
}

const paperSx: SxProps = {
  p: 1,
  cursor: 'pointer',
  display: 'flex',
  flexWrap: 'nowrap',
};

const OtherPlayersPosition: React.FC<OtherPlayersPositionProps> = ({ bookId, chapters }) => {
  const { data = [] } = usePositionGetBookQuery({ bookId });
  const { data: friendsData = [] } = usePositionGetFriendsBookQuery({ bookId });
  const { instanceId } = useAppSelector(({ websocket }) => websocket);
  const dispatch = useAppDispatch();

  const positions = data
    .filter(entry => entry.instanceId !== instanceId && !(entry.currentChapter === 0 && entry.position === 0))
    .sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());

  const friendsPositions = friendsData
    .filter(entry => !(entry.currentChapter === 0 && entry.position === 0))
    .sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());

  if (positions.length === 0 && friendsPositions.length === 0) return;

  const getPlayerStateChangeHandler = (currentChapter: number, position: number) => () => {
    dispatch(updateBookState({ currentChapter, position, bookId }));
  };

  const formatChapterName = (currentChapter: number) => {
    const chapterTitle = chapters[currentChapter].title;
    const chapterNumber = currentChapter + 1;
    const titleIsChapterNumber = +chapterTitle === chapterNumber;

    return `${chapterNumber}${!titleIsChapterNumber ? ` (${chapterTitle})`: ''}`;
  };

  const formatUpdated = (updated: string) => {
    const updatedToday = new Date().toDateString() === new Date(updated).toDateString();
    return Intl.DateTimeFormat(undefined, {
      dateStyle: updatedToday ? undefined : 'short',
      timeStyle: 'medium',
    }).format(new Date(updated));
  };

  return (
    <Accordion square>
      <AccordionSummary expandIcon={<ExpandMore />}>Other players position</AccordionSummary>
      <AccordionDetails>
        {positions.map(({ instanceId, currentChapter, position, updated }) => {
          return (
            <Paper square key={instanceId} sx={paperSx} onClick={getPlayerStateChangeHandler(currentChapter, position)}>
              <Typography>
                Current chapter {formatChapterName(currentChapter)}, position: {formatTime(position)}, updated:{' '}
                {formatUpdated(updated)}
              </Typography>
            </Paper>
          );
        })}
        {friendsPositions.map(
          ({ instanceId, currentChapter, position, updated, friendId, friendLogin, friendName }) => {
            return (
              <Paper
                square
                key={`${instanceId}${friendId}`}
                sx={paperSx}
                onClick={getPlayerStateChangeHandler(currentChapter, position)}
              >
                <Typography>
                  Friend {getFriendDisplayName({ uid: friendId, login: friendLogin, name: friendName })}, current
                  chapter {formatChapterName(currentChapter)}, position: {formatTime(position)}, updated:{' '}
                  {formatUpdated(updated)}
                </Typography>
              </Paper>
            );
          }
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default OtherPlayersPosition;
