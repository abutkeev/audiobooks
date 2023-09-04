import React from 'react';
import { Paper } from '@mui/material';
import Chapters from './chapters';
import { Book } from '../../api/api';
import Controls from './controls';
import usePlayerState, { PlayerPosition, PlayerStateContext } from './state/usePlayerState';
import PlayerError from './PlayerError';
import useKeyboardShortcuts from './useKeyboardShortcuts';
import useMediaSession, { BookInfo } from './media-session/useMediaSession';

interface PlayerProps {
  bookId: string;
  info: BookInfo;
  chapters: Book['chapters'];
  generateUrl(state: PlayerPosition): string;
}

const Player: React.FC<PlayerProps> = ({ bookId, info, chapters, generateUrl }) => {
  const [state, dispatch] = usePlayerState(bookId, chapters);
  useKeyboardShortcuts(state, dispatch);
  useMediaSession(info, chapters[state.currentChapter].title, state, dispatch);

  return (
    <PlayerStateContext.Provider value={{ state, bookId, dispatch, chapters, generateUrl }}>
      <Paper sx={{ maxWidth: 'md', flexGrow: 1, mx: 'auto' }} square>
        <Controls />
        <PlayerError />
        <Chapters />
      </Paper>
    </PlayerStateContext.Provider>
  );
};

export default Player;
