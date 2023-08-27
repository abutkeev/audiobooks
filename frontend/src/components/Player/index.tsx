import React from 'react';
import { Paper } from '@mui/material';
import Chapter from './Chapter';
import { Book } from '../../api/api';
import Controls from './controls';
import usePlayerState, {
  PlayerStateContext,
  chapterChange,
} from './usePlayerState';

interface PlayerProps {
  bookId: string;
  chapters: Book['chapters'];
}

const Player: React.FC<PlayerProps> = ({ bookId, chapters }) => {
  const [{ state, audioRef }, dispatch] = usePlayerState(bookId, chapters);
  const { currentChapter } = state;
  const handleChapterClick = (chapter: number) => () => dispatch(chapterChange(chapter));

  return (
    <PlayerStateContext.Provider value={{ state, dispatch, chapters }}>
      <Paper sx={{ maxWidth: 'md', flexGrow: 1 }}>
        <Controls />
        {chapters.map(({ title }, i) => (
          <Chapter key={i} title={title} onClick={handleChapterClick(i)} current={currentChapter === i} />
        ))}
        <audio ref={audioRef} />
      </Paper>
    </PlayerStateContext.Provider>
  );
};

export default Player;
