import React, { useEffect } from 'react';
import { Paper } from '@mui/material';
import Chapters from './chapters';
import { Book } from '../../api/api';
import Controls from './controls';
import PlayerError from './PlayerError';
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts';
import useMediaSession from '../../hooks/media-session/useMediaSession';
import { useAppDispatch } from '../../store';
import { BookInfo, setBookInfo, playerSetup, playerReset } from '../../store/features/player';

interface PlayerProps {
  bookId: string;
  bookInfo: BookInfo;
  chapters: Book['chapters'];
  // generateUrl(state: PlayerPosition): string;
  // externalState?: ExternalPlayerState;
  // onStateUpdate(state: PlayerState): void;
}

const Player: React.FC<PlayerProps> = ({ bookId, bookInfo, chapters }) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(playerSetup({ bookId, chapters }));
    () => {
      dispatch(playerReset());
    };
  }, [bookId, chapters]);

  useEffect(() => {
    dispatch(setBookInfo(bookInfo));
  }, [bookInfo]);

  useKeyboardShortcuts();
  useMediaSession();

  return (
    <Paper square>
      <Controls />
      <PlayerError />
      <Chapters />
    </Paper>
  );
};

export default Player;
