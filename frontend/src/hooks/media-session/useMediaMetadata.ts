import { useEffect } from 'react';

interface BookMetadata {
  name: string;
  author: string;
  series?: string;
  cover?: {
    type: string;
    filename: string;
  };
  chapterTitle: string;
}

const useMediaMetadata = ({ name, author, series, cover, chapterTitle }: BookMetadata) => {
  const { mediaSession } = navigator;

  useEffect(() => {
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
  }, [name, author, series, chapterTitle, cover, mediaSession]);
};

export default useMediaMetadata;
