import { ActionCreatorWithPayload, ActionCreatorWithoutPayload, AnyAction } from '@reduxjs/toolkit';
import { Dispatch, useEffect, useRef } from 'react';

export interface UpdateAudioControl {
  chapter?: {
    number: number;
    position: number;
    play: boolean;
  };
  position?: number;
  playing?: boolean;
  volume?: number;
}
interface AudioControlArg {
  chapters: {
    filename: string;
  }[];
  updateAudio?: UpdateAudioControl;
  dispatch: Dispatch<AnyAction>;
  actions: {
    audioUpdated: ActionCreatorWithPayload<'chapter' | 'position' | 'playing' | 'volume'>;
    updatePlaying: ActionCreatorWithPayload<boolean>;
    updatePosition: ActionCreatorWithPayload<number>;
    updateDuration: ActionCreatorWithPayload<number>;
    chapterEnded: ActionCreatorWithoutPayload;
    setError: ActionCreatorWithPayload<string>;
  };
}

const useAudioControl = ({
  chapters,
  updateAudio,
  dispatch,
  actions: { audioUpdated, updatePlaying, updatePosition, updateDuration, chapterEnded, setError },
}: AudioControlArg) => {
  const audioRef = useRef<HTMLAudioElement>();
  const playRef = useRef<boolean>();
  const positionRef = useRef<number>();
  const { chapter, position, playing, volume } = updateAudio || {};

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.oncanplay = () => {
      if (!audioRef.current) return;
      dispatch(updateDuration(audioRef.current.duration));
      if (positionRef.current) {
        if (positionRef.current < 0) {
          const newPosition = audioRef.current.duration + positionRef.current;
          audioRef.current.currentTime = newPosition > 0 ? newPosition : 0;
        } else {
          audioRef.current.currentTime =
            positionRef.current < audioRef.current.duration ? positionRef.current : audioRef.current.duration;
        }
        positionRef.current = undefined;
      }
      if (playRef.current) {
        audioRef.current.play();
        dispatch(updatePlaying(true));
        playRef.current = undefined;
      }
    };
    audioRef.current.onplaying = () => dispatch(updatePlaying(true));
    audioRef.current.onpause = () => dispatch(updatePlaying(false));
    audioRef.current.onended = () => dispatch(chapterEnded());
    audioRef.current.onerror = e => {
      dispatch(updatePlaying(false));
      if (typeof e === 'string') {
        dispatch(setError(e));
        return;
      }
      console.error(e);
      dispatch(setError('An error occurred, see console log for details'));
    };
    const intervalId = setInterval(() => {
      if (!audioRef.current) return;
      dispatch(updatePosition(audioRef.current.currentTime));
      dispatch(updateDuration(audioRef.current.duration));
      dispatch(updatePlaying(!audioRef.current.paused));
    }, 1000);
    return () => {
      clearInterval(intervalId);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current || !chapter) return;
    const { number, position, play } = chapter;
    if (number < 0 || number > chapters.length - 1) return;
    playRef.current = play;
    positionRef.current = position;
    audioRef.current.pause();
    audioRef.current.src = `${chapters[number].filename}`;
    audioRef.current.load();
    dispatch(audioUpdated('chapter'));
  }, [chapter, chapters]);

  useEffect(() => {
    if (!audioRef.current || position === undefined || !isFinite(position) || position < 0) return;
    audioRef.current.currentTime = position;
    dispatch(audioUpdated('position'));
  }, [position]);

  useEffect(() => {
    if (!audioRef.current || playing === undefined) return;
    if (playing) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
    dispatch(audioUpdated('playing'));
  }, [playing]);

  useEffect(() => {
    if (!audioRef.current || volume === undefined || volume < 0 || volume > 1) return;
    audioRef.current.volume = volume;
    dispatch(audioUpdated('volume'));
  }, [volume]);
};

export default useAudioControl;
