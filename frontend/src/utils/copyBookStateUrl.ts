import copy from 'copy-to-clipboard';
import { store } from '../store';
import { BookState } from '../store/features/player';
import { addSnackbar } from '../store/features/snackbars';

const copyBookStateUrl = ({ currentChapter, position }: BookState) => {
  copy(`${location.toString()}?currentChapter=${currentChapter}&position=${position}`);
  store.dispatch(addSnackbar({ severity: 'success', text: 'Copied to clipboard', timeout: 2000 }));
};
export default copyBookStateUrl;
