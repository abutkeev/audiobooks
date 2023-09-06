import { useContext } from 'react';
import { PlayerStateContext } from '../state/usePlayerState';
import { DownloadForOffline, Downloading } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';

const BookCacheIcon: React.FC = () => {
  const {
    cache: { state },
  } = useContext(PlayerStateContext);
  // no cache
  if (state.filter(entry => entry).length === 0) return null;

  // all cached
  if (state.filter(entry => !entry || entry.state !== 'cached').length === 0) {
    return <DownloadForOffline />;
  }

  // download in progress
  if (state.findIndex(entry => entry && entry.state !== 'cached') !== -1) {
    const downloadPercent = (state.filter(entry => entry && entry.state === 'cached').length * 100) / state.length;
    return <CircularProgress size={24} variant='determinate' value={downloadPercent} />;
  }

  return <Downloading />;
};

export default BookCacheIcon;
