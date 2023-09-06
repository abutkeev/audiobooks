import React from 'react';
import { Paper } from '@mui/material';
import Chapters from './chapters';
import { Book } from '../../api/api';
import Controls from './controls';
import usePlayerState, {
  ExternalPlayerState,
  PlayerPosition,
  PlayerState,
  PlayerStateContext,
} from './state/usePlayerState';
import PlayerError from './PlayerError';
import useKeyboardShortcuts from './useKeyboardShortcuts';
import useMediaSession, { BookInfo } from './media-session/useMediaSession';
import useCache from './state/useCache';

interface PlayerProps {
  bookId: string;
  info: BookInfo;
  chapters: Book['chapters'];
  generateUrl(state: PlayerPosition): string;
  externalState?: ExternalPlayerState;
  onStateUpdate(state: PlayerState): void;
}

const Player: React.FC<PlayerProps> = ({ bookId, info, chapters, generateUrl, externalState, onStateUpdate }) => {
  const [state, dispatch] = usePlayerState(bookId, chapters, externalState, onStateUpdate);
  const cache = useCache(chapters);
  useKeyboardShortcuts(state, dispatch);
  useMediaSession(info, chapters[state.currentChapter].title, state, dispatch);

  return (
    <PlayerStateContext.Provider value={{ state, bookId, dispatch, chapters, generateUrl, cache }}>
      <Paper sx={{ maxWidth: 'md', flexGrow: 1, mx: 'auto' }} square>
        <Controls />
        <PlayerError />
        <Chapters />
      </Paper>
    </PlayerStateContext.Provider>
  );
};

export default Player;
