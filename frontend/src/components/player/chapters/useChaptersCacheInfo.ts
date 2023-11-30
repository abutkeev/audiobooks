import useMediaCache from '@/hooks/useMediaCache';
import { useAppSelector } from '@/store';

const useChaptersCacheInfo = () => {
  const chapters = useAppSelector(({ player: { chapters } }) => chapters);
  const cache = useMediaCache();
  if (!cache.available) return {};

  const none = chapters.every(({ filename }) => !cache.entries[filename]);
  const all = chapters.every(({ filename }) => cache.entries[filename]?.state === 'cached');
  const downloading = chapters.some(({ filename }) => cache.entries[filename]?.state === 'downloading');
  const cached = chapters.filter(({ filename }) => cache.entries[filename]?.state === 'cached').length;
  const keys = chapters.map(({ filename }) => filename);

  return { none, all, downloading, cached, keys, available: cache.available };
};

export default useChaptersCacheInfo;
