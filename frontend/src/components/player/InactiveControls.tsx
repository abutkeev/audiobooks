import { Accordion, AccordionDetails, AccordionSummary, Paper, Slider, Stack, Typography } from '@mui/material';
import { ExpandMore, Forward10, PlayArrow, Replay10, SkipNext, SkipPrevious } from '@mui/icons-material';
import ControlButton from './controls/ControlButton';
import PositionPlaceholder from './controls/PositionPlaceholder';
import Chapter from './chapters/Chapter';
import ChaptersSummary from './chapters/ChaptersSummary';
import useSavedBookState from './useSavedBookState';
import useMediaCache from '@/hooks/useMediaCache';
import formatTime from '@/utils/formatTime';
import { useAppDispatch } from '@/store';
import { BookChapter, BookInfo, playerSetup, setBookInfo } from '@/store/features/player';

interface InactiveControlsProps {
  bookId: string;
  bookInfo: BookInfo;
  chapters: BookChapter[];
}

/** Another book holds the player: the page shows where this one stands and waits for a click to take it over. */
const InactiveControls: React.FC<InactiveControlsProps> = ({ bookId, bookInfo, chapters }) => {
  const dispatch = useAppDispatch();
  const { currentChapter, position } = useSavedBookState(bookId, chapters.length);
  const cache = useMediaCache();
  const duration = chapters[currentChapter]?.duration;

  // both the chapter and the intent to play go into the setup: a play or a chapterChange
  // afterwards would find the chapter loading without duration and load it a second time
  const activate = (currentChapter?: number) => {
    dispatch(playerSetup({ bookId, chapters, playing: true, currentChapter }));
    dispatch(setBookInfo(bookInfo));
  };

  return (
    <Paper square>
      <Paper square sx={{ p: 1 }}>
        <Stack direction='row' sx={{ justifyContent: 'center' }}>
          <ControlButton Icon={SkipPrevious} disabled />
          <ControlButton Icon={Replay10} disabled />
          <ControlButton main Icon={PlayArrow} onClick={() => activate()} />
          <ControlButton Icon={Forward10} disabled />
          <ControlButton Icon={SkipNext} disabled />
        </Stack>
        <Stack spacing={2} direction='row' sx={{ alignItems: 'center', mx: 1, mt: 1 }}>
          {duration ? (
            <>
              <Typography sx={{ cursor: 'default' }}>{formatTime(position)}</Typography>
              <Slider sx={{ flexGrow: 1 }} value={position} max={duration} disabled />
              <Typography sx={{ cursor: 'default' }}>{formatTime(duration)}</Typography>
            </>
          ) : (
            <PositionPlaceholder />
          )}
        </Stack>
      </Paper>
      <Accordion square>
        <AccordionSummary expandIcon={<ExpandMore />} onClick={({ currentTarget }) => currentTarget.blur()}>
          <ChaptersSummary chapters={chapters} currentChapter={currentChapter} />
        </AccordionSummary>
        <AccordionDetails>
          {chapters.map(({ title, duration }, i) => (
            <Chapter
              key={i}
              title={title}
              duration={duration}
              onClick={() => activate(i)}
              current={currentChapter === i}
              cacheState={cache.entries[chapters[i].filename]}
            />
          ))}
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default InactiveControls;
