import { DownloadForOffline, ErrorOutline } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { MediaCacheEntryState } from '../../../store/features/media-cache';

interface ChapterCacheIconProps {
  cacheState?: MediaCacheEntryState;
}

const ChapterCacheIcon: React.FC<ChapterCacheIconProps> = ({ cacheState }) => {
  if (!cacheState) return null;
  const { state } = cacheState;
  switch (state) {
    case 'cached':
      return <DownloadForOffline />;
    case 'downloading':
      return (
        <CircularProgress
          size={24}
          value={cacheState.progress}
          variant={cacheState.progress ? 'determinate' : 'indeterminate'}
        />
      );
    case 'error':
      return <ErrorOutline color='error' />;
    default:
      console.error(`unknown chapter cache state ${state}`);
      return null;
  }
};

export default ChapterCacheIcon;
