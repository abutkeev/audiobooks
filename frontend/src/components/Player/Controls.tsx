import { Forward10, Pause, PlayArrow, Replay10, SkipNext, SkipPrevious } from '@mui/icons-material';
import { Grid, IconButton, Paper, Slider, Stack, Typography } from '@mui/material';
import React from 'react';

interface ControlsProps {
  position?: number;
  duration?: number;
  playing: boolean;
  firstChapter?: boolean;
  lastChapter?: boolean;
  handlePositionChange(newPosition: number): void;
  handlePreviousChapter(): void;
  handleNextChapter(): void;
  handlePlayPause(): void;
}

const formatTime = (time: number) => {
  if (time < 0) return;
  const hours = Math.floor(time / (60 * 60));
  const minutes = Math.floor((time % (60 * 60)) / 60);
  const seconds = Math.floor(time % 60);
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  if (hours === 0) return `${formattedMinutes}:${formattedSeconds}`;
  return `${hours}:${formattedMinutes}:${formattedSeconds}`;
};

const Controls: React.FC<ControlsProps> = ({
  position,
  duration,
  playing,
  firstChapter,
  lastChapter,
  handlePositionChange,
  handlePreviousChapter,
  handleNextChapter,
  handlePlayPause,
}) => {
  const handleRewind = () => position !== undefined && handlePositionChange(position > 10 ? position - 10 : 0);
  const handleForward = () =>
    position !== undefined && duration && handlePositionChange(position + 10 < duration ? position + 10 : duration);
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
        <IconButton color='primary' disabled={firstChapter} onClick={handlePreviousChapter}>
          <SkipPrevious fontSize='large' />
        </IconButton>
        <IconButton color='primary' onClick={handleRewind} disabled={!position}>
          <Replay10 fontSize='large' />
        </IconButton>
        <IconButton color='secondary' onClick={handlePlayPause}>
          {playing ? <Pause sx={{ fontSize: 70 }} /> : <PlayArrow sx={{ fontSize: 70 }} />}
        </IconButton>
        <IconButton
          color='primary'
          onClick={handleForward}
          disabled={position === undefined || !duration || position === duration}
        >
          <Forward10 fontSize='large' />
        </IconButton>
        <IconButton color='primary' disabled={lastChapter} onClick={handleNextChapter}>
          <SkipNext fontSize='large' />
        </IconButton>
      </Stack>
      <Grid container>
        <Grid item xs={4}>
          <Stack></Stack>
        </Grid>
      </Grid>
      {position !== undefined && duration && (
        <Stack spacing={2} direction='row' mx={1}>
          <Typography>{formatTime(position)}</Typography>
          <Slider
            value={position}
            onChange={(_, position) => typeof position === 'number' && handlePositionChange(position)}
            max={duration}
            valueLabelDisplay='auto'
            valueLabelFormat={formatTime}
          />
          <Typography>{formatTime(duration)}</Typography>
        </Stack>
      )}
    </Paper>
  );
};

export default Controls;
