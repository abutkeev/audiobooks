import { Bedtime, BedtimeOff } from '@mui/icons-material';
import ControlButton from './ControlButton';
import { useContext, useEffect, useState } from 'react';
import { Menu, MenuItem, Stack, Typography } from '@mui/material';
import { PlayerStateContext, pause, setPauseOnChapterEnd } from '../state/usePlayerState';
import formatTime from '../../../utils/formatTime';

const SleepControl: React.FC = () => {
  const [menuAhchor, setMenuAnchor] = useState<HTMLElement>();
  const [sleepTimerDuration, setSleepTimerDuration] = useState<number>();
  const [sleepTimerStart, setSleepTimerStart] = useState<Date>();
  const [sleepTimerLeft, setSleepTimerLeft] = useState<number>();
  const {
    state: { pauseOnChapterEnd, resetSleepTimerOnActivity },
    dispatch,
  } = useContext(PlayerStateContext);

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
  }, [sleepTimerDuration, sleepTimerStart]);

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

  const closeMenu = () => setMenuAnchor(undefined);
  const setSleepTimer = (duration: number) => () => {
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
  };
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
      {pauseOnChapterEnd && <Typography>on chapter end</Typography>}
      <Menu anchorEl={menuAhchor} open={!!menuAhchor} onClose={closeMenu}>
        {(!!sleepTimerLeft || pauseOnChapterEnd) && (
          <MenuItem onClick={setSleepTimer(0)}>
            <Typography>Switch off</Typography>
          </MenuItem>
        )}
        <MenuItem onClick={setSleepTimer(15)}>
          <Typography>15 min</Typography>
        </MenuItem>
        <MenuItem onClick={setSleepTimer(30)}>
          <Typography>30 min</Typography>
        </MenuItem>
        <MenuItem onClick={setSleepTimer(45)}>
          <Typography>45 min</Typography>
        </MenuItem>
        <MenuItem onClick={setSleepTimer(60)}>
          <Typography>1 hour</Typography>
        </MenuItem>
        <MenuItem onClick={setSleepTimer(120)}>
          <Typography>2 hours</Typography>
        </MenuItem>
        {!pauseOnChapterEnd && (
          <MenuItem onClick={handlePauseOnChaperEnd}>
            <Typography>Pause on chapter end</Typography>
          </MenuItem>
        )}
      </Menu>
    </Stack>
  );
};

export default SleepControl;
