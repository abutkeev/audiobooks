import useMediaSession from '@/hooks/media-session/useMediaSession';
import useWakeLock from '@/hooks/useWakeLock';

// nothing is rendered on purpose: the hooks below read the player slice, which changes every
// second, see docs/ai/frontend/player.md, "Media Session API"
const PlayerHost: React.FC = () => {
  useMediaSession();
  useWakeLock();

  return null;
};

export default PlayerHost;
