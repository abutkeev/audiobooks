import { useEffect, useState } from 'react';

const localStorageStateName = 'playerState';

const usePlayerState = (bookId: string) => {
  let savedChapter = 0;
  let savedPosition = 0;
  const savedState = localStorage.getItem(localStorageStateName);
  if (savedState) {
    try {
      const { currentChapter, position, bookId: savedBookId } = JSON.parse(savedState);
      if (savedBookId === bookId) {
        if (isFinite(currentChapter) && currentChapter > 0) {
          savedChapter = currentChapter;
        }
        if (isFinite(position) && position > 0) {
          savedPosition = position;
        }
      }
    } catch {
      //ignore parse error
    }
  }

  const [currentChapter, setCurrentChapter] = useState<number>(savedChapter);
  const [position, setPosition] = useState<number>(savedPosition);

  useEffect(() => {
    localStorage.setItem(
      localStorageStateName,
      JSON.stringify({ bookId, currentChapter, position, updated: new Date().toISOString() })
    );
  }, [bookId, currentChapter, position]);

  return { position, setPosition, currentChapter, setCurrentChapter };
};

export default usePlayerState;
