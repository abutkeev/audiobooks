import React, { useEffect } from 'react';
import { Paper } from '@mui/material';
import Chapters from './chapters';
import Controls from './controls';
import PlayerError from './PlayerError';
import InactiveControls from './InactiveControls';
import useKeyboardShortcuts from '@/hooks/useKeyboardShortcuts';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  BookInfo,
  setBookInfo,
  playerSetup,
  updateBookState,
  updateChapters,
  BookChapter,
} from '@/store/features/player';

interface PlayerProps {
  bookId: string;
  bookInfo: BookInfo;
  chapters: BookChapter[];
  externalState?: { position: number; currentChapter: number };
  onExternalStateApply?(): void;
}

const Player: React.FC<PlayerProps> = ({ bookId, bookInfo, chapters, externalState, onExternalStateApply }) => {
  const dispatch = useAppDispatch();
  const activeBookId = useAppSelector(({ player }) => player.bookId);
  const active = activeBookId === bookId;

  // the page takes a free player only; an occupied one keeps its book until the user says
  // otherwise, see docs/ai/frontend/player.md, "Жизненный цикл сессии"
  useEffect(() => {
    if (active) {
      dispatch(updateChapters(chapters));
      return;
    }

    if (!activeBookId) {
      dispatch(playerSetup({ bookId, chapters }));
    }
  }, [active, activeBookId, bookId, chapters, dispatch]);

  useEffect(() => {
    if (!active) return;

    dispatch(setBookInfo(bookInfo));
  }, [active, bookInfo, dispatch]);

  useEffect(() => {
    if (!externalState) return;

    // a shared position is an explicit request to listen to this book, so it takes the player over;
    // a free player has been taken by the effect above already
    if (activeBookId && !active) {
      dispatch(playerSetup({ bookId, chapters }));
      dispatch(setBookInfo(bookInfo));
    }

    dispatch(updateBookState({ ...externalState, bookId }));
    if (onExternalStateApply) {
      onExternalStateApply();
    }
  }, [active, activeBookId, externalState, onExternalStateApply, bookId, bookInfo, chapters, dispatch]);

  useKeyboardShortcuts(active);

  if (!active) {
    return <InactiveControls bookId={bookId} bookInfo={bookInfo} chapters={chapters} />;
  }

  return (
    <Paper square>
      <Controls />
      <PlayerError />
      <Chapters />
    </Paper>
  );
};

export default Player;
