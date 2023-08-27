import { SkipPrevious, Replay10, Pause, PlayArrow, Forward10, SkipNext } from '@mui/icons-material';
import { Stack } from '@mui/material';
import ControlButton from './ControlButton';
import { useContext } from 'react';
import { PlayerStateContext, changePosition, chapterChange, playPause } from '../usePlayerState';
import React from 'react';

const PlayerControlPanel: React.FC = () => {
  const {
    state: { position, duration, currentChapter, playing },
    chapters,
    dispatch,
  } = useContext(PlayerStateContext);

  const handlePlayPause = () => dispatch(playPause());
  const handlePreviousChapter = () => dispatch(chapterChange(currentChapter - 1));
  const handleNextChapter = () => currentChapter !== chapters.length - 1 && dispatch(chapterChange(currentChapter + 1));
  const handleRewind = (amount: number) => () => dispatch(changePosition(position > amount ? position - amount : 0));
  const handleForward = (amount: number) => () =>
    duration && dispatch(changePosition(position + amount < duration ? position + amount : duration));
  const handleKeyDown = (e: KeyboardEvent) => {
    const { code } = e;
    const disableDefaultActions = () => {
      e.preventDefault();
    };
    switch (code) {
      case 'Space':
      case 'KeyK':
        handlePlayPause();
        disableDefaultActions();
        break;
      case 'ArrowLeft':
        handleRewind(15)();
        disableDefaultActions();
        break;
      case 'ArrowRight':
        handleForward(15)();
        disableDefaultActions();
        break;
      case 'KeyJ':
        handleRewind(30)();
        disableDefaultActions();
        break;
      case 'KeyL':
        handleForward(30)();
        disableDefaultActions();
        break;
      case 'KeyN':
        handleNextChapter();
        disableDefaultActions();
        break;
      case 'KeyP':
        handlePreviousChapter();
        disableDefaultActions();
        break;
    }
  };

  React.useEffect(() => {
    navigator.mediaSession.setActionHandler('previoustrack', handleRewind(10));
    navigator.mediaSession.setActionHandler('nexttrack', handleForward(10));
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      navigator.mediaSession.setActionHandler('previoustrack', null);
      navigator.mediaSession.setActionHandler('nexttrack', null);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [position, duration]);

  return (
    <Stack direction='row' justifyContent='center'>
      <ControlButton Icon={SkipPrevious} disabled={currentChapter === 0} onClick={handlePreviousChapter} />
      <ControlButton Icon={Replay10} onClick={handleRewind(10)} disabled={!position} />
      <ControlButton main Icon={playing ? Pause : PlayArrow} onClick={handlePlayPause} />
      <ControlButton Icon={Forward10} onClick={handleForward(10)} disabled={!duration || position === duration} />
      <ControlButton Icon={SkipNext} disabled={currentChapter === chapters.length - 1} onClick={handleNextChapter} />
    </Stack>
  );
};

export default PlayerControlPanel;
