import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { useEffect, useReducer } from 'react';

interface UploadingState {
  chapters: {
    title: string;
    originalTitle: string;
    status: 'new' | 'uploading' | 'uploaded';
  }[];
  errors: ('required' | 'duplicate' | undefined)[];
  valid?: boolean;
}

const initialState: UploadingState = {
  chapters: [],
  errors: [],
};

const prefixNumbersRegex = /^[0-9. ]+/;

const uploadingSlice = createSlice({
  name: 'UploadSlice',
  initialState,
  reducers: {
    setup: (state, { payload }: PayloadAction<string[]>) => {
      state.chapters = [];
      for (const title of payload) {
        state.chapters.push({ title, originalTitle: title, status: 'new' });
      }
    },
    setTitle: (state, { payload }: PayloadAction<{ index: number; title: string }>) => {
      const { index, title } = payload;
      if (state.chapters.length <= index) return;
      state.chapters[index].title = title;
    },
    resetTitles: state => {
      state.chapters.forEach(({ originalTitle }, index) => {
        state.chapters[index].title = originalTitle;
      });
    },
    stripPrefixNumbers: state => {
      state.chapters.forEach(({ title }, index) => {
        state.chapters[index].title = title.replace(prefixNumbersRegex, '');
      });
    },
    removeTitles: state => {
      state.chapters.forEach((_, index) => {
        state.chapters[index].title = `${index + 1}`;
      });
    },
    startUploading: (state, { payload }: PayloadAction<number>) => {
      state.chapters[payload].status = 'uploading';
    },
    setUploaded: (state, { payload }: PayloadAction<number>) => {
      state.chapters[payload].status = 'uploaded';
    },
    stopUploading: state => {
      const index = state.chapters.findIndex(({ status }) => status === 'uploading');
      if (index === -1) return;
      state.chapters[index].status = 'new';
    },
  },
  extraReducers: builder => {
    builder.addMatcher(
      () => true,
      state => {
        state.chapters.forEach((chapter, index) => {
          if (!chapter.title) {
            state.errors[index] = 'required';
            return;
          }
          if (state.chapters.find(({ title }, i) => title === chapter.title && index !== i)) {
            state.errors[index] = 'duplicate';
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
const useUploading = (titles?: string[]) => {
  const [state, dispatch] = useReducer(uploadingSlice.reducer, uploadingSlice.getInitialState());
  useEffect(() => {
    if (!titles) return;
    dispatch(setup(titles));
  }, [titles]);

  return [state, dispatch] as const;
};

export const { setTitle, resetTitles, stripPrefixNumbers, startUploading, stopUploading, setUploaded, removeTitles } =
  uploadingSlice.actions;
export default useUploading;
