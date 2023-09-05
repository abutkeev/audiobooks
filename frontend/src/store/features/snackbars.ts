import { AlertProps } from '@mui/material';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface SnackbarMessage {
  text: string;
  timeout?: number;
  severity?: AlertProps['severity'];
}
const initialState: SnackbarMessage[] = [];

const snackbarsSlice = createSlice({
  name: 'snackbars',
  initialState,
  reducers: {
    addSnackbar: (state, { payload }: PayloadAction<SnackbarMessage>) => {
      state.push(payload);
    },
    removeSnackbar: state => {
      state.shift();
    },
  },
});

export const { addSnackbar, removeSnackbar } = snackbarsSlice.actions;

export default snackbarsSlice;
