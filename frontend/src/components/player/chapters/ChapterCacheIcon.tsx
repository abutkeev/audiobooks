import { DownloadForOffline } from '@mui/icons-material';
import { ChapterCacheState } from '../state/useCache';

interface ChapterCacheIconProps {
  cacheState: ChapterCacheState;
}

const ChapterCacheIcon: React.FC<ChapterCacheIconProps> = ({ cacheState }) => {
  if (!cacheState) return null;
  const { state } = cacheState;
  switch (state) {
    case 'cached':
      return <DownloadForOffline />;
    default:
      console.error(`unknown chapter cache state ${state}`);
      return null;
  }
};

export default ChapterCacheIcon;
