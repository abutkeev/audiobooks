import { useContext } from 'react';
import { PlayerStateContext, chapterChange } from '../state/usePlayerState';
import Chapter from './Chapter';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import BookCacheIcon from './BookCacheIcon';
import { ExpandMore } from '@mui/icons-material';
import useMediaCache from '../../../hooks/useMediaCache';

const Chapters: React.FC = () => {
  const {
    state: { currentChapter },
    chapters,
    dispatch,
  } = useContext(PlayerStateContext);
  const cache = useMediaCache();

  const handleChapterClick = (chapter: number) => () => dispatch(chapterChange(chapter));
  const currentChapterTitle = chapters[currentChapter].title;
  const chapterNumber = currentChapter + 1;
  const titleIsNumber = +currentChapterTitle === chapterNumber;

  return (
    <Accordion square>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography flexGrow={1}>
          Current chapter {chapterNumber} of {chapters.length} {!titleIsNumber && `(${currentChapterTitle})`}
        </Typography>
        <BookCacheIcon />
      </AccordionSummary>
      <AccordionDetails>
        {chapters.map(({ title }, i) => (
          <Chapter
            key={i}
            title={title}
            onClick={handleChapterClick(i)}
            current={currentChapter === i}
            cacheState={cache.entries[chapters[i].filename]}
          />
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

export default Chapters;
