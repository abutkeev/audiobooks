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

  return (
    <Accordion>
      <AccordionSummary>
        <Typography>Current chapter {chapters[currentChapter].title}</Typography>
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
