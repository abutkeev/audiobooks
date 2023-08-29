import { useEffect } from 'react';

interface BookMetadata {
  name: string;
  author: string;
  series?: string;
  chapterTitle: string;
}

const useMediaMetadata = ({ name, author, series, chapterTitle }: BookMetadata) => {
  const { mediaSession } = navigator;

  useEffect(() => {
    const title = `${name}` + (chapterTitle && ` (${chapterTitle})`);
    mediaSession.metadata = new MediaMetadata({
      title,
      artist: author,
      album: series,
    });
    return () => {
      mediaSession.metadata = null;
    };
  }, [name, author, series, chapterTitle]);
};

export default useMediaMetadata;
