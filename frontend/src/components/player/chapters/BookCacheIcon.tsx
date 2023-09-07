import { DownloadForOffline, Downloading } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import useChaptersCacheInfo from './useChaptersCacheInfo';

const BookCacheIcon: React.FC = () => {
  const { available, none, all, downloading, cached, keys } = useChaptersCacheInfo();

  if (!available || none) return null;

  if (all) return <DownloadForOffline />;

  if (downloading) {
    return <CircularProgress size={24} variant='determinate' value={(cached * 100) / keys.length} />;
  }

  return <Downloading />;
};

export default BookCacheIcon;
