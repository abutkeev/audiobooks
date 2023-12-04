import useFormattedDateTime from '@/hooks/useFormattedDateTime';
import { useAppDispatch } from '@/store';
import { updateBookState } from '@/store/features/player';
import formatTime from '@/utils/formatTime';
import getFriendDisplayName from '@/utils/getFriendDisplayName';
import { Paper, Typography } from '@mui/material';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface PlayerStateEntryProps {
  bookId: string;
  instanceId: string;
  currentChapter: number;
  position: number;
  updated: string;
  friend?: { uid: string; login: string; name: string };
  chapters: { title: string }[];
}

const PlayerStateEntry: FC<PlayerStateEntryProps> = ({
  bookId,
  currentChapter,
  position,
  updated,
  friend,
  chapters,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const chapterName = useMemo(() => {
    const chapterTitle = chapters[currentChapter].title;
    const chapterNumber = currentChapter + 1;
    const titleIsChapterNumber = +chapterTitle === chapterNumber;

    return `${chapterNumber}${!titleIsChapterNumber ? ` (${chapterTitle})` : ''}`;
  }, [currentChapter, chapters]);

  const updatedDate = useMemo(() => {
    try {
      return new Date(updated);
    } catch {
      return undefined;
    }
  }, [updated]);

  const formattedUpdated = useFormattedDateTime(updatedDate, 'medium');

  const handlePlayerStateChange = () => {
    dispatch(updateBookState({ currentChapter, position, bookId }));
  };

  return (
    <Paper
      square
      sx={{
        p: 1,
        cursor: 'pointer',
        display: 'flex',
        flexWrap: 'nowrap',
      }}
      onClick={handlePlayerStateChange}
    >
      <Typography>
        {friend
          ? t('Friend {{friend}}, current chapter {{currentChapter}}, position: {{position}}, updated: {{updated}}', {
              friend: getFriendDisplayName(friend),
              currentChapter: chapterName,
              position: formatTime(position),
              updated: formattedUpdated,
            })
          : t('Current chapter {{currentChapter}}, position: {{position}}, updated: {{updated}}', {
              currentChapter: chapterName,
              position: formatTime(position),
              updated: formattedUpdated,
            })}
      </Typography>
    </Paper>
  );
};

export default PlayerStateEntry;
