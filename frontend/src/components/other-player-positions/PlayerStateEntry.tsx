import { usePositionRemoveMutation } from '@/api/api';
import useFormattedDateTime from '@/hooks/useFormattedDateTime';
import { useAppDispatch } from '@/store';
import { updateBookState } from '@/store/features/player';
import formatTime from '@/utils/formatTime';
import getFriendDisplayName from '@/utils/getFriendDisplayName';
import { Paper, Stack, Typography } from '@mui/material';
import { FC, MouseEvent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteButton from '../common/DeleteButton';

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
  instanceId,
  currentChapter,
  position,
  updated,
  friend,
  chapters,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [remove] = usePositionRemoveMutation();

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

  const handleRemove = async (e: MouseEvent) => {
    e.stopPropagation();
    await remove({ bookId, instanceId });
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
      <Stack direction='row' spacing={1} flexGrow={1}>
        <Typography flexGrow={1}>
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
        {!friend && (
          <DeleteButton
            onConfirm={handleRemove}
            confirmationTitle={t('Remove postiton?')}
            confirmationBody={t(
              'Remove position (current chapter {{currentChapter}}, position: {{position}}, updated: {{updated}})?',
              {
                currentChapter: chapterName,
                position: formatTime(position),
                updated: formattedUpdated,
              }
            )}
          />
        )}
      </Stack>
    </Paper>
  );
};

export default PlayerStateEntry;
