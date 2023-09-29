import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { useEffect, useReducer } from 'react';

interface UploadingState {
  chapters: {
    file: File;
    title: string;
  }[];
  errors: ('Required field' | 'Should be unique' | undefined)[];
  valid?: boolean;
  uploading?: {
    file: File;
    title: string;
    percent: number;
  };
}

const initialState: UploadingState = {
  chapters: [],
  errors: [],
};

const getDefaultTitle = ({ name }: File) => {
  return name.replace(/\.mp3/i, '');
};

const prefixNumbersRegex = /^[0-9. ]+/;

const uploadingSlice = createSlice({
  name: 'UploadSlice',
  initialState,
  reducers: {
    setup: (state, { payload }: PayloadAction<File[]>) => {
      state.chapters = [];
      for (const file of payload) {
        state.chapters.push({ file, title: getDefaultTitle(file) });
      }
    },
    setTitle: (state, { payload }: PayloadAction<{ index: number; title: string }>) => {
      const { index, title } = payload;
      if (state.chapters.length <= index) return;
      state.chapters[index].title = title;
    },
    resetTitles: state => {
      state.chapters.forEach(({ file }, index) => {
        state.chapters[index].title = getDefaultTitle(file);
      });
    },
    stripPrefixNumbers: state => {
      state.chapters.forEach(({ title }, index) => {
        state.chapters[index].title = title.replace(prefixNumbersRegex, '');
      });
    },
    startUploading: (state, { payload }: PayloadAction<{ file: File; title: string }>) => {
      const { file, title } = payload;
      state.chapters = state.chapters.filter(entry => entry.title !== title);
      state.uploading = { file, title, percent: 0 };
    },
    stopUploading: state => {
      if (!state.uploading) return;
      const { file, title } = state.uploading;
      state.chapters.unshift({ file, title });
      state.uploading = undefined;
    },
    setProgress: (state, { payload }: PayloadAction<number>) => {
      if (!state.uploading) return;
      state.uploading.percent = payload < 0 ? 0 : payload > 100 ? 100 : payload;
    },
  },
  extraReducers: builder => {
    builder.addMatcher(
      () => true,
      state => {
        state.chapters.forEach((chapter, index) => {
          if (!chapter.title) {
            state.errors[index] = 'Required field';
            return;
          }
          if (state.chapters.find(({ title }, i) => title === chapter.title && index !== i)) {
            state.errors[index] = 'Should be unique';
            return;
          }
          state.errors[index] = undefined;
        });
        state.valid = !state.errors.find(entry => !!entry) && state.chapters.length !== 0;
      }
    );
  },
});

const { setup } = uploadingSlice.actions;
const useUploading = (files?: File[]) => {
  const [state, dispatch] = useReducer(uploadingSlice.reducer, uploadingSlice.getInitialState());
  useEffect(() => {
    if (!files) return;
    dispatch(setup(files));
  }, [files]);

  return [state, dispatch] as const;
};

export const { setTitle, resetTitles, stripPrefixNumbers, startUploading, stopUploading, setProgress } =
  uploadingSlice.actions;
export default useUploading;
