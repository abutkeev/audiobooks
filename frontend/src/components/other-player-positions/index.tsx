import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { usePositionGetBookQuery, usePositionGetFriendsBookQuery, usePositionGetUserBookQuery } from '@/api/api';
import { useAppSelector } from '@/store';
import { useTranslation } from 'react-i18next';
import PlayerStateEntry from './PlayerStateEntry';
import { useMemo } from 'react';
import useAuthData from '@/hooks/useAuthData';
import { useSearchParams } from 'react-router-dom';

interface OtherPlayersPositionProps {
  bookId: string;
  chapters: { title: string }[];
}

const OtherPlayersPosition: React.FC<OtherPlayersPositionProps> = ({ bookId, chapters }) => {
  const { t } = useTranslation();
  const { data = [] } = usePositionGetBookQuery({ bookId });
  const { admin, id: authId } = useAuthData() || {};
  const [searchParams] = useSearchParams();
  // admins can open a book from user books list to inspect positions of that user only
  const inspectedUserId = admin ? searchParams.get('user_id') || '' : '';
  const { data: friendsData = [] } = usePositionGetFriendsBookQuery({ bookId }, { skip: !!inspectedUserId });
  const { data: userData = [] } = usePositionGetUserBookQuery(
    { bookId, userId: inspectedUserId },
    { skip: !inspectedUserId || inspectedUserId === authId }
  );
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

  const userPositions = useMemo(
    () =>
      userData
        .filter(entry => !(entry.currentChapter === 0 && entry.position === 0))
        .sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime()),
    [userData]
  );

  if (positions.length === 0 && friendsPositions.length === 0 && userPositions.length === 0) return;

  return (
    <Accordion square>
      <AccordionSummary expandIcon={<ExpandMore />} onClick={({ currentTarget }) => currentTarget.blur()}>
        <Typography>{t('Other players position')}</Typography>
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
        {userPositions.map(({ instanceId, currentChapter, position, updated, userId, userLogin, userName }) => {
          return (
            <PlayerStateEntry
              key={`${instanceId}${userId}`}
              instanceId={instanceId}
              bookId={bookId}
              currentChapter={currentChapter}
              position={position}
              updated={updated}
              chapters={chapters}
              user={{ uid: userId, login: userLogin, name: userName }}
            />
          );
        })}
      </AccordionDetails>
    </Accordion>
  );
};

export default OtherPlayersPosition;
