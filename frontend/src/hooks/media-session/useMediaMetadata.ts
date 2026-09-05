import { useEffect } from 'react';

interface BookMetadata {
  active: boolean;
  name: string;
  author: string;
  series?: string;
  cover?: {
    type: string;
    filename: string;
  };
  chapterTitle: string;
}

const useMediaMetadata = ({ active, name, author, series, cover, chapterTitle }: BookMetadata) => {
  const { mediaSession } = navigator;

  useEffect(() => {
    if (!active) {
      mediaSession.metadata = null;
      return;
    }

    const title = `${name}` + (chapterTitle && ` (${chapterTitle})`);
    mediaSession.metadata = new MediaMetadata({
      title,
      artist: author,
      album: series,
      artwork: cover
        ? [
            {
              src: cover.filename,
              type: cover.type,
            },
          ]
        : undefined,
    });
    return () => {
      mediaSession.metadata = null;
    };
  }, [active, name, author, series, chapterTitle, cover, mediaSession]);
};

export default useMediaMetadata;
