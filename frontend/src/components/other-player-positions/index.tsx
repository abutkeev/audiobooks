import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { usePositionGetBookQuery, usePositionGetFriendsBookQuery } from '@/api/api';
import { useAppSelector } from '@/store';
import { useTranslation } from 'react-i18next';
import PlayerStateEntry from './PlayerStateEntry';
import { useMemo } from 'react';

interface OtherPlayersPositionProps {
  bookId: string;
  chapters: { title: string }[];
}

const OtherPlayersPosition: React.FC<OtherPlayersPositionProps> = ({ bookId, chapters }) => {
  const { t } = useTranslation();
  const { data = [] } = usePositionGetBookQuery({ bookId });
  const { data: friendsData = [] } = usePositionGetFriendsBookQuery({ bookId });
  const { instanceId } = useAppSelector(({ websocket }) => websocket);

  const positions = useMemo(
    () =>
      data
        .filter(entry => entry.instanceId !== instanceId && !(entry.currentChapter === 0 && entry.position === 0))
        .sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime()),
    [data, instanceId]
  );

  const friendsPositions = useMemo(
    () =>
      friendsData
        .filter(entry => !(entry.currentChapter === 0 && entry.position === 0))
        .sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime()),
    [friendsData]
  );

  if (positions.length === 0 && friendsPositions.length === 0) return;

  return (
    <Accordion square>
      <AccordionSummary expandIcon={<ExpandMore />} onClick={({ currentTarget }) => currentTarget.blur()}>
        {t('Other players position')}
      </AccordionSummary>
      <AccordionDetails>
        {positions.map(({ instanceId, currentChapter, position, updated }) => {
          return (
            <PlayerStateEntry
              key={instanceId}
              instanceId={instanceId}
              bookId={bookId}
              currentChapter={currentChapter}
              position={position}
              updated={updated}
              chapters={chapters}
            />
          );
        })}
        {friendsPositions.map(
          ({ instanceId, currentChapter, position, updated, friendId, friendLogin, friendName }) => {
            return (
              <PlayerStateEntry
                key={`${instanceId}${friendId}`}
                instanceId={instanceId}
                bookId={bookId}
                currentChapter={currentChapter}
                position={position}
                updated={updated}
                chapters={chapters}
                friend={{ uid: friendId, login: friendLogin, name: friendName }}
              />
            );
          }
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default OtherPlayersPosition;
