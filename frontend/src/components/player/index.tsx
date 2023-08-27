import React from 'react';
import { Paper } from '@mui/material';
import Chapters from './chapters';
import { Book } from '../../api/api';
import Controls from './controls';
import usePlayerState, { PlayerStateContext } from './usePlayerState';
import PlayerError from './PlayerError';

interface PlayerProps {
  bookId: string;
  chapters: Book['chapters'];
}

const Player: React.FC<PlayerProps> = ({ bookId, chapters }) => {
  const [{ state, audioRef }, dispatch] = usePlayerState(bookId, chapters);

  return (
    <PlayerStateContext.Provider value={{ state, dispatch, chapters }}>
      <Paper sx={{ maxWidth: 'md', flexGrow: 1, mx: 'auto' }}>
        <Controls />
        <PlayerError />
        <Chapters />
        <audio ref={audioRef} />
      </Paper>
    </PlayerStateContext.Provider>
  );
};

export default Player;
