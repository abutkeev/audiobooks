import { useState } from 'react';

const usePlayerState = () => {
  const [currentChapter, setCurrentChapter] = useState<number>(0);
  const [position, setPosition] = useState<number>(0);

  return { position, setPosition, currentChapter, setCurrentChapter };
};

export default usePlayerState;
