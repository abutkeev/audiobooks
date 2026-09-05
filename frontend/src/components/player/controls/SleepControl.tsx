import { Bedtime, BedtimeOff } from '@mui/icons-material';
import ControlButton from './ControlButton';
import { useCallback, useEffect, useState } from 'react';
import { Menu, MenuItem, Stack, Typography } from '@mui/material';
import formatTime from '@/utils/formatTime';
import { useAppDispatch, useAppSelector } from '@/store';
import { clearSleepTimer, setPauseOnChapterEnd, setSleepTimer } from '@/store/features/player';
import { useTranslation } from 'react-i18next';

const leftUpdateInterval = 500;

const SleepControl: React.FC = () => {
  const { t } = useTranslation();
  const [menuAhchor, setMenuAnchor] = useState<HTMLElement>();
  const pauseOnChapterEnd = useAppSelector(({ player: { state } }) => state.pauseOnChapterEnd);
  const endsAt = useAppSelector(({ player }) => player.sleepTimer?.endsAt);
  const dispatch = useAppDispatch();

  // kept out of the store: writing the remaining time there twice a second would wake every
  // position saver, see docs/ai/frontend/player.md
  const [left, setLeft] = useState<number>();

  useEffect(() => {
    if (!endsAt) {
      setLeft(undefined);
      return;
    }

    const update = () => setLeft(Math.max(endsAt - Date.now(), 0) / 1000);

    update();
    const intervalId = setInterval(update, leftUpdateInterval);
    return () => clearInterval(intervalId);
  }, [endsAt]);

  const closeMenu = useCallback(() => setMenuAnchor(undefined), [setMenuAnchor]);

  const setTimer = useCallback(
    (duration: number) => () => {
      closeMenu();
      dispatch(setPauseOnChapterEnd(false));
      dispatch(duration > 0 ? setSleepTimer(duration) : clearSleepTimer());
    },
    [closeMenu, dispatch]
  );

  const handlePauseOnChaperEnd = () => {
    setTimer(0)();
    dispatch(setPauseOnChapterEnd(true));
  };

  return (
    <Stack direction='row' sx={{ alignItems: 'center' }}>
      <ControlButton
        Icon={endsAt || pauseOnChapterEnd ? Bedtime : BedtimeOff}
        small
        onClick={e => setMenuAnchor(e.currentTarget)}
      />
      {!!left && <Typography>{formatTime(left)}</Typography>}
      {pauseOnChapterEnd && <Typography>{t('on chapter end')}</Typography>}
      <Menu anchorEl={menuAhchor} open={!!menuAhchor} onClose={closeMenu}>
        {(!!left || pauseOnChapterEnd) && (
          <MenuItem onClick={setTimer(0)}>
            <Typography>{t('Switch off')}</Typography>
          </MenuItem>
        )}
        <MenuItem onClick={setTimer(15)}>
          <Typography>15 {t('min')}</Typography>
        </MenuItem>
        <MenuItem onClick={setTimer(30)}>
          <Typography>30 {t('min')}</Typography>
        </MenuItem>
        <MenuItem onClick={setTimer(45)}>
          <Typography>45 {t('min')}</Typography>
        </MenuItem>
        <MenuItem onClick={setTimer(60)}>
          <Typography>1 {t('hour')}</Typography>
        </MenuItem>
        <MenuItem onClick={setTimer(120)}>
          <Typography>2 {t('hours')}</Typography>
        </MenuItem>
        {!pauseOnChapterEnd && (
          <MenuItem onClick={handlePauseOnChaperEnd}>
            <Typography>{t('Pause on chapter end')}</Typography>
          </MenuItem>
        )}
      </Menu>
    </Stack>
  );
};

export default SleepControl;
