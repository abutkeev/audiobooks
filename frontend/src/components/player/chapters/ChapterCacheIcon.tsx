import { DownloadForOffline, ErrorOutline } from '@mui/icons-material';
import { ChapterCacheState } from '../state/useCache';
import { CircularProgress } from '@mui/material';

interface ChapterCacheIconProps {
  cacheState: ChapterCacheState;
}

const ChapterCacheIcon: React.FC<ChapterCacheIconProps> = ({ cacheState }) => {
  if (!cacheState) return null;
  const { state } = cacheState;
  switch (state) {
    case 'cached':
      return <DownloadForOffline />;
    case 'pending':
      return null;
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
