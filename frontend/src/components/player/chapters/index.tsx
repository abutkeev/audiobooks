import { useContext } from 'react';
import { PlayerStateContext, chapterChange } from '../state/usePlayerState';
import Chapter from './Chapter';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';

const Chapters: React.FC = () => {
  const {
    state: { currentChapter },
    chapters,
    dispatch,
  } = useContext(PlayerStateContext);
  const handleChapterClick = (chapter: number) => () => dispatch(chapterChange(chapter));
  const currentChapterTitle = chapters[currentChapter].title;
  const chapterNumber = currentChapter + 1;
  const titleIsNumber = +currentChapterTitle === chapterNumber;

  return (
    <Accordion square>
      <AccordionSummary>
        <Typography>
          Current chapter {chapterNumber} of {chapters.length} {!titleIsNumber && `(${currentChapterTitle})`}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {chapters.map(({ title }, i) => (
          <Chapter key={i} title={title} onClick={handleChapterClick(i)} current={currentChapter === i} />
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

export default Chapters;
