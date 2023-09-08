import { AudioControllAddListrers } from '.';
import { changePosition, playerSlice } from '..';
import { loadChapter, startUpdates, stopUpdates } from '../internal';

const addLoadChapterAction: AudioControllAddListrers = (mw, audio) => {
  const { updateDuration, updatePlaying, setError, updateCurrentChapter } = playerSlice.actions;

  mw.startListening({
    actionCreator: loadChapter,
    effect: async ({ payload }, { getState, dispatch }) => {
      const { chapters, state } = getState().player;

      if (state.playing) {
        dispatch(stopUpdates());
        audio.pause();
      }

      dispatch(updateDuration(undefined));
      dispatch(updateCurrentChapter(payload.number));

      const loaded = new Promise<void>((resolve, reject) => {
        const onError = (e: ErrorEvent) => reject(e);
        audio.addEventListener('error', onError, { once: true });
        audio.addEventListener(
          'canplay',
          () => {
            audio.removeEventListener('error', onError);
            resolve();
          },
          { once: true }
        );
      });

      audio.src = chapters[payload.number].filename;
      audio.load();

      try {
        await loaded;
        if (payload.position !== undefined) {
          const { position } = payload;
          const { duration } = audio;
          if (payload.position >= 0) {
            dispatch(changePosition(position < duration ? position : duration));
          } else {
            // position is negative
            const newPosition = duration + position;
            dispatch(changePosition(newPosition > 0 ? newPosition : 0));
          }
        } else {
          dispatch(changePosition(state.position));
        }

        dispatch(updateDuration(audio.duration));

        if (state.playing) {
          audio.play();
          dispatch(startUpdates());
        }
      } catch (e) {
        dispatch(updatePlaying(false));
        setError("Can't load chapter");
        console.error("Can't load chapter", e);
      }
    },
  });
};

export default addLoadChapterAction;
