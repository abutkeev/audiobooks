import React from 'react';
import { Paper } from '@mui/material';
import Chapter from './Chapter';
import { Book } from '../../api/api';

interface PlayerProps {
  bookId: string;
  chapters: Book['chapters'];
}

const Player: React.FC<PlayerProps> = ({ chapters }) => {
  const [currentChapter, setCurrentChapter] = React.useState<number>();
  const handleChapterClick = (chapter: number) => () => {
    setCurrentChapter(chapter);
  };

  return (
    <Paper sx={{ maxWidth: 'md', flexGrow: 1 }}>
      {chapters.map(({ title }, i) => (
        <Chapter key={i} title={title} onClick={handleChapterClick(i)} current={currentChapter === i} />
      ))}
    </Paper>
  );
};

export default Player;
