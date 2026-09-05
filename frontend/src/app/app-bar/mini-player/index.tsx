import { Close, Pause, PlayArrow } from '@mui/icons-material';
import { IconButton, Stack, Toolbar, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useMiniPlayerState from './useMiniPlayerState';
import Link from '@/components/common/Link';
import { useAppDispatch, useAppSelector } from '@/store';
import { closePlayer, pause, play } from '@/store/features/player';

const MiniPlayer: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { visible, closeable } = useMiniPlayerState();
  // separate primitive selectors: the whole player slice changes every second
  const bookId = useAppSelector(({ player }) => player.bookId);
  const name = useAppSelector(({ player }) => player.bookInfo.name);
  const playing = useAppSelector(({ player }) => player.state.playing);
  // the error alert lives on the book page, and a failure happens while it is off screen too;
  // shown as text, not only as a tooltip, which a touch screen never opens
  const error = useAppSelector(({ player }) => player.state.error);

  if (!visible) return null;

  const handlePlayPause: React.MouseEventHandler<HTMLButtonElement> = e => {
    e.currentTarget.blur();
    dispatch(playing ? pause() : play());
  };

  return (
    <Toolbar variant='dense'>
      <Stack direction='row' spacing={1} sx={{ alignItems: 'center', width: '100%', minWidth: 0 }}>
        <Tooltip title={playing ? t('Pause') : t('Play')}>
          <IconButton color={error ? 'error' : 'inherit'} onClick={handlePlayPause}>
            {playing ? <Pause /> : <PlayArrow />}
          </IconButton>
        </Tooltip>
        <Tooltip title={t('Back to the book')}>
          <Link
            to={`/book/${bookId}`}
            color={error ? 'error' : 'inherit'}
            underline='hover'
            noWrap
            sx={{ flexGrow: 1, minWidth: 0 }}
          >
            {error || name}
          </Link>
        </Tooltip>
        {closeable && (
          <Tooltip title={t('Close player')}>
            <IconButton color='inherit' onClick={() => dispatch(closePlayer())}>
              <Close />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </Toolbar>
  );
};

export default MiniPlayer;
