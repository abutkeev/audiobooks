import { useEffect, useState } from 'react';

const localStorageStateName = 'playerState';

const usePlayerState = (bookId: string) => {
  let savedChapter = 0;
  let savedPosition = 0;
  let savedVolume = 100;
  const savedState = localStorage.getItem(localStorageStateName);
  if (savedState) {
    try {
      const { currentChapter, position, bookId: savedBookId, volume } = JSON.parse(savedState);
      if (savedBookId === bookId) {
        if (isFinite(currentChapter) && currentChapter > 0) {
          savedChapter = currentChapter;
        }
        if (isFinite(position) && position > 0) {
          savedPosition = position;
        }
      }
      if (isFinite(volume) && volume > 0 && volume < 100) {
        savedVolume = volume;
      }
    } catch {
      //ignore parse error
    }
  }

  const [currentChapter, setCurrentChapter] = useState(savedChapter);
  const [position, setPosition] = useState(savedPosition);
  const [volume, setVolume] = useState(savedVolume);

  useEffect(() => {
    localStorage.setItem(
      localStorageStateName,
      JSON.stringify({ bookId, currentChapter, position, volume, updated: new Date().toISOString() })
    );
  }, [bookId, currentChapter, position, volume]);

  return { position, setPosition, currentChapter, setCurrentChapter, volume, setVolume };
};

export default usePlayerState;
