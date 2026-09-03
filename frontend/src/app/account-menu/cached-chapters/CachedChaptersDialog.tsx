import { FC } from 'react';
import CachedChaptersDialogContent from './CachedChaptersDialogContent';

interface CachedChaptersDialogProps {
  open: boolean;
  close(): void;
}

// cache polling and books list are only needed while the dialog is shown
const CachedChaptersDialog: FC<CachedChaptersDialogProps> = ({ open, close }) =>
  open ? <CachedChaptersDialogContent close={close} /> : null;

export default CachedChaptersDialog;
