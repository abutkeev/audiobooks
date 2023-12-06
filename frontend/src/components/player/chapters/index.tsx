import Chapter from './Chapter';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import BookCacheIcon from './BookCacheIcon';
import { ExpandMore } from '@mui/icons-material';
import useMediaCache from '@/hooks/useMediaCache';
import { useAppDispatch, useAppSelector } from '@/store';
import { chapterChange } from '@/store/features/player';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import formatTime from '@/utils/formatTime';

const Chapters: React.FC = () => {
  const { t } = useTranslation();
  const {
    state: { currentChapter, position },
    chapters,
  } = useAppSelector(({ player }) => player);
  const dispatch = useAppDispatch();
  const cache = useMediaCache();

  const durations = useMemo(
    () =>
      chapters.reduce(
        (result: { current: number; total: number } | undefined, { duration }, index) => {
          if (!result || !duration) {
            return undefined;
          }

          if (currentChapter > index) {
            result.current += duration;
          }
          result.total += duration;
          return result;
        },
        { current: position || 0, total: 0 }
      ),
    [chapters, currentChapter, position]
  );

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
        {durations && (
          <Typography>
            {formatTime(durations.current)}/{formatTime(durations.total)}
          </Typography>
        )}
        <BookCacheIcon />
      </AccordionSummary>
      <AccordionDetails>
        {chapters.map(({ title, duration }, i) => (
          <Chapter
            key={i}
            title={title}
            duration={duration}
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
