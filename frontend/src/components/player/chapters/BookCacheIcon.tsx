import { useContext } from 'react';
import { PlayerStateContext } from '../state/usePlayerState';
import { DownloadForOffline, Downloading } from '@mui/icons-material';

const BookCacheIcon: React.FC = () => {
  const {
    cache: { state },
  } = useContext(PlayerStateContext);
  // no cache
  if (state.filter(entry => entry).length === 0) return null;

  // all cached
  if (state.filter(entry => !entry || entry.state !== 'cached').length === 0) return <DownloadForOffline />;

  return <Downloading />;
};

export default BookCacheIcon;
