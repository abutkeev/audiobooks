import { SkipPrevious, Replay10, Pause, PlayArrow, Forward10, SkipNext } from '@mui/icons-material';
import { Stack } from '@mui/material';
import ControlButton from './ControlButton';
import { useContext } from 'react';
import { PlayerStateContext, chapterChange, forward, playPause, rewind } from '../usePlayerState';
import React from 'react';

const mediaKeysRewindTime = 10;
const arrowKeysRewindTime = 15;
const letterKeysRewindTime = 30;

const PlayerControlPanel: React.FC = () => {
  const {
    state: { position, duration, currentChapter, playing },
    chapters,
    dispatch,
  } = useContext(PlayerStateContext);

  const handlePlayPause = () => dispatch(playPause());
  const handlePreviousChapter = () => dispatch(chapterChange(currentChapter - 1));
  const handleNextChapter = () => currentChapter !== chapters.length - 1 && dispatch(chapterChange(currentChapter + 1));
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
        dispatch(rewind(arrowKeysRewindTime));
        disableDefaultActions();
        break;
      case 'ArrowRight':
        dispatch(forward(arrowKeysRewindTime));
        disableDefaultActions();
        break;
      case 'KeyJ':
        dispatch(rewind(letterKeysRewindTime));
        disableDefaultActions();
        break;
      case 'KeyL':
        dispatch(forward(letterKeysRewindTime));
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
    navigator.mediaSession.setActionHandler('previoustrack', () => dispatch(rewind(mediaKeysRewindTime)));
    navigator.mediaSession.setActionHandler('nexttrack', () => dispatch(forward(mediaKeysRewindTime)));
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
      <ControlButton
        Icon={Replay10}
        onClick={() => dispatch(rewind(10))}
        disabled={!position && currentChapter === 0}
      />
      <ControlButton main Icon={playing ? Pause : PlayArrow} onClick={handlePlayPause} />
      <ControlButton
        Icon={Forward10}
        onClick={() => dispatch(forward(10))}
        disabled={!duration || (position === duration && currentChapter === chapters.length - 1)}
      />
      <ControlButton Icon={SkipNext} disabled={currentChapter === chapters.length - 1} onClick={handleNextChapter} />
    </Stack>
  );
};

export default PlayerControlPanel;
