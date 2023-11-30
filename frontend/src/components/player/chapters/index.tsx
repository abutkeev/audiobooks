import Chapter from './Chapter';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import BookCacheIcon from './BookCacheIcon';
import { ExpandMore } from '@mui/icons-material';
import useMediaCache from '@/hooks/useMediaCache';
import { useAppDispatch, useAppSelector } from '@/store';
import { chapterChange } from '@/store/features/player';
import { useTranslation } from 'react-i18next';

const Chapters: React.FC = () => {
  const { t } = useTranslation();
  const {
    state: { currentChapter },
    chapters,
  } = useAppSelector(({ player }) => player);
  const dispatch = useAppDispatch();
  const cache = useMediaCache();

  if (chapters.length === 0) return;

  const handleChapterClick = (chapter: number) => () => dispatch(chapterChange(chapter));
  const currentChapterTitle = chapters[currentChapter].title;
  const chapterNumber = currentChapter + 1;
  const titleIsNumber = +currentChapterTitle === chapterNumber;

  return (
    <Accordion square>
      <AccordionSummary expandIcon={<ExpandMore />} onClick={({ currentTarget }) => currentTarget.blur()}>
        <Typography flexGrow={1}>
          {t('Current chapter')} {chapterNumber} {t('of')} {chapters.length}{' '}
          {!titleIsNumber && `(${currentChapterTitle})`}
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
