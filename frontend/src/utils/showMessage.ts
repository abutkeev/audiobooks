import { store } from '../store';
import { SnackbarMessage, addSnackbar } from '../store/features/snackbars';

const showMessage = (message: SnackbarMessage) => {
  store.dispatch(addSnackbar(message));
};
export default showMessage;
