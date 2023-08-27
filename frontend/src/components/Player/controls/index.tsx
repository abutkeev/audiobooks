import { Forward10, Pause, PlayArrow, Replay10, SkipNext, SkipPrevious } from '@mui/icons-material';
import { Grid, Paper, Stack } from '@mui/material';
import React from 'react';
import ControlButton from './ControlButton';
import VolumeControl from './VolumeControl';
import { PlayerStateContext, changePosition, chapterChange, playPause } from '../usePlayerState';
import PositionControl from './PositionControl';

const Controls: React.FC = () => {
  const {
    state: { position, duration, currentChapter, playing },
    chapters,
    dispatch,
  } = React.useContext(PlayerStateContext);
  const handlePlayPause = () => dispatch(playPause());
  const handlePreviousChapter = () => dispatch(chapterChange(currentChapter - 1));
  const handleNextChapter = () => currentChapter !== chapters.length - 1 && dispatch(chapterChange(currentChapter + 1));
  const handleRewind = () => dispatch(changePosition(position > 10 ? position - 10 : 0));
  const handleForward = () => duration && dispatch(changePosition(position + 10 < duration ? position + 10 : duration));
  React.useEffect(() => {
    navigator.mediaSession.setActionHandler('previoustrack', handleRewind);
    navigator.mediaSession.setActionHandler('nexttrack', handleForward);
    return () => {
      navigator.mediaSession.setActionHandler('previoustrack', null);
      navigator.mediaSession.setActionHandler('nexttrack', null);
    };
  }, [position, duration]);
  return (
    <Paper square sx={{ p: 1 }}>
      <Stack direction='row' justifyContent='center'>
        <ControlButton Icon={SkipPrevious} disabled={currentChapter === 0} onClick={handlePreviousChapter} />
        <ControlButton Icon={Replay10} onClick={handleRewind} disabled={!position} />
        <ControlButton main Icon={playing ? Pause : PlayArrow} onClick={handlePlayPause} />
        <ControlButton Icon={Forward10} onClick={handleForward} disabled={!duration || position === duration} />
        <ControlButton Icon={SkipNext} disabled={currentChapter === chapters.length - 1} onClick={handleNextChapter} />
      </Stack>
      <Grid container p={1}>
        <Grid item xs={4}>
          <VolumeControl />
        </Grid>
      </Grid>
      <PositionControl />
    </Paper>
  );
};

export default Controls;
