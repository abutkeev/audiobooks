import React from 'react';
import { Paper } from '@mui/material';
import Chapters from './chapters';
import { Book } from '../../api/api';
import Controls from './controls';
import usePlayerState, { PlayerStateContext } from './state/usePlayerState';
import PlayerError from './PlayerError';
import useKeyboardShortcuts from './useKeyboardShortcuts';
import useMediaSession, { BookInfo } from './media-session/useMediaSession';

interface PlayerProps {
  bookId: string;
  info: BookInfo;
  chapters: Book['chapters'];
}

const Player: React.FC<PlayerProps> = ({ bookId, info, chapters }) => {
  const [state, dispatch] = usePlayerState(bookId, chapters);
  useKeyboardShortcuts(state, dispatch);
  useMediaSession(info, chapters[state.currentChapter].title, state, dispatch);

  return (
    <PlayerStateContext.Provider value={{ state, bookId, dispatch, chapters }}>
      <Paper sx={{ maxWidth: 'md', flexGrow: 1, mx: 'auto' }}>
        <Controls />
        <PlayerError />
        <Chapters />
      </Paper>
    </PlayerStateContext.Provider>
  );
};

export default Player;
