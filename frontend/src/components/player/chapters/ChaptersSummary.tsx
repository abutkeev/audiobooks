import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { BookChapter } from '@/store/features/player';

interface ChaptersSummaryProps {
  chapters: BookChapter[];
  currentChapter: number;
}

const ChaptersSummary: React.FC<ChaptersSummaryProps> = ({ chapters, currentChapter }) => {
  const { t } = useTranslation();
  const title = chapters[currentChapter]?.title ?? '';
  const number = currentChapter + 1;
  const titleIsNumber = +title === number;

  return (
    <Typography sx={{ flexGrow: 1 }}>
      {t('Current chapter')} {number} {t('of')} {chapters.length} {!titleIsNumber && `(${title})`}
    </Typography>
  );
};

export default ChaptersSummary;
