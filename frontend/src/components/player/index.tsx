import React, { useEffect } from 'react';
import { Paper } from '@mui/material';
import Chapters from './chapters';
import { Book } from '../../api/api';
import Controls from './controls';
import PlayerError from './PlayerError';
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts';
import useMediaSession from '../../hooks/media-session/useMediaSession';
import { useAppDispatch } from '../../store';
import { BookInfo, setBookInfo, playerSetup, playerReset, updateBookState } from '../../store/features/player';

interface PlayerProps {
  bookId: string;
  bookInfo: BookInfo;
  chapters: Book['chapters'];
  externalState?: { position: number; currentChapter: number };
  onExternalStateApply?(): void;
}

const Player: React.FC<PlayerProps> = ({ bookId, bookInfo, chapters, externalState, onExternalStateApply }) => {
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

  useEffect(() => {
    if (externalState) {
      dispatch(updateBookState({ ...externalState, bookId }));
      if (onExternalStateApply) {
        onExternalStateApply();
      }
    }
  }, [externalState, onExternalStateApply]);

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
