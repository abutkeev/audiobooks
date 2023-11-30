import { Alert, Snackbar as MuiSnackbar } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store';
import { removeSnackbar } from '@/store/features/snackbars';

const Snackbar: React.FC = () => {
  const snackbars = useAppSelector(({ snackbars }) => snackbars);
  const dispatch = useAppDispatch();

  if (snackbars.length === 0) return null;

  const { text, severity, timeout } = snackbars[0];

  return (
    <MuiSnackbar
      open
      autoHideDuration={timeout}
      onClose={() => dispatch(removeSnackbar())}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert severity={severity ?? 'info'}>{text}</Alert>
    </MuiSnackbar>
  );
};

export default Snackbar;
