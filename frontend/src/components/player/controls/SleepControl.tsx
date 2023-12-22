import { Bedtime, BedtimeOff } from '@mui/icons-material';
import ControlButton from './ControlButton';
import { useCallback, useEffect, useState } from 'react';
import { Menu, MenuItem, Stack, Typography } from '@mui/material';
import formatTime from '@/utils/formatTime';
import { useAppDispatch, useAppSelector } from '@/store';
import { pause, setPauseOnChapterEnd } from '@/store/features/player';
import { useTranslation } from 'react-i18next';

const SleepControl: React.FC = () => {
  const { t } = useTranslation();
  const [menuAhchor, setMenuAnchor] = useState<HTMLElement>();
  const [sleepTimerDuration, setSleepTimerDuration] = useState<number>();
  const [sleepTimerStart, setSleepTimerStart] = useState<Date>();
  const [sleepTimerLeft, setSleepTimerLeft] = useState<number>();
  const { pauseOnChapterEnd, resetSleepTimerOnActivity } = useAppSelector(({ player: { state } }) => state);
  const dispatch = useAppDispatch();

  const closeMenu = useCallback(() => setMenuAnchor(undefined), [setMenuAnchor]);

  const setSleepTimer = useCallback(
    (duration: number) => () => {
      closeMenu();
      dispatch(setPauseOnChapterEnd(false));
      if (duration <= 0) {
        setSleepTimerDuration(undefined);
        setSleepTimerLeft(undefined);
        setSleepTimerStart(undefined);
        return;
      }
      setSleepTimerDuration(duration);
      setSleepTimerStart(new Date());
      setSleepTimerLeft(duration * 60);
    },
    [closeMenu, setSleepTimerDuration, setSleepTimerLeft, setSleepTimerStart, dispatch]
  );

  useEffect(() => {
    if (sleepTimerDuration && sleepTimerStart) {
      const updateSleepTimerLeft = () => {
        const endTimestamp = sleepTimerStart.getTime() + sleepTimerDuration * 60 * 1000;
        const left = endTimestamp - new Date().getTime();
        if (left < 0) {
          setSleepTimer(0)();
          dispatch(pause());
          clearInterval(intervalId);
          return;
        }
        setSleepTimerLeft(left / 1000);
      };
      const intervalId = setInterval(updateSleepTimerLeft, 500);
      return () => clearInterval(intervalId);
    }
  }, [sleepTimerDuration, sleepTimerStart, dispatch, setSleepTimer]);

  useEffect(() => {
    const resetSleepTimerStart = () => {
      if (sleepTimerDuration) setSleepTimerLeft(sleepTimerDuration * 60);
      setSleepTimerStart(new Date());
    };
    const removeEventListeners = () => {
      window.removeEventListener('mousemove', resetSleepTimerStart);
      window.removeEventListener('keydown', resetSleepTimerStart);
    };
    if (sleepTimerStart && resetSleepTimerOnActivity) {
      window.addEventListener('mousemove', resetSleepTimerStart);
      window.addEventListener('keydown', resetSleepTimerStart);
      return removeEventListeners;
    }
    removeEventListeners();
  }, [sleepTimerStart, sleepTimerDuration, resetSleepTimerOnActivity]);

  const handlePauseOnChaperEnd = () => {
    setSleepTimer(0)();
    dispatch(setPauseOnChapterEnd(true));
  };

  return (
    <Stack direction='row' alignItems='center'>
      <ControlButton
        Icon={sleepTimerDuration || pauseOnChapterEnd ? Bedtime : BedtimeOff}
        small
        onClick={e => setMenuAnchor(e.currentTarget)}
      />
      {!!sleepTimerLeft && <Typography>{formatTime(sleepTimerLeft)}</Typography>}
      {pauseOnChapterEnd && <Typography>{t('on chapter end')}</Typography>}
      <Menu anchorEl={menuAhchor} open={!!menuAhchor} onClose={closeMenu}>
        {(!!sleepTimerLeft || pauseOnChapterEnd) && (
          <MenuItem onClick={setSleepTimer(0)}>
            <Typography>{t('Switch off')}</Typography>
          </MenuItem>
        )}
        <MenuItem onClick={setSleepTimer(15)}>
          <Typography>15 {t('min')}</Typography>
        </MenuItem>
        <MenuItem onClick={setSleepTimer(30)}>
          <Typography>30 {t('min')}</Typography>
        </MenuItem>
        <MenuItem onClick={setSleepTimer(45)}>
          <Typography>45 {t('min')}</Typography>
        </MenuItem>
        <MenuItem onClick={setSleepTimer(60)}>
          <Typography>1 {t('hour')}</Typography>
        </MenuItem>
        <MenuItem onClick={setSleepTimer(120)}>
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
