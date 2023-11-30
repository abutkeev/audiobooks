import copy from 'copy-to-clipboard';
import { store } from '@/store';
import { BookState } from '@/store/features/player';
import { addSnackbar } from '@/store/features/snackbars';
import { t } from 'i18next';

const copyBookStateUrl = ({ currentChapter, position }: BookState) => {
  copy(`${location.toString()}?currentChapter=${currentChapter}&position=${position}`);
  store.dispatch(addSnackbar({ severity: 'success', text: t('Copied to clipboard'), timeout: 2000 }));
};
export default copyBookStateUrl;
