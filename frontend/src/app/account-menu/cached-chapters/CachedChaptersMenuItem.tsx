import { FC } from 'react';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { DownloadForOffline } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { mediaCacheSupported } from '@/store/features/media-cache';
import { AccountMenuDialogItemProps } from '..';

const CachedChaptersMenuItem: FC<AccountMenuDialogItemProps> = ({ setShowDialog, closeMenu }) => {
  const { t } = useTranslation();

  const handleShowDialog = () => {
    setShowDialog(true);
    closeMenu();
  };

  if (!mediaCacheSupported) return null;

  return (
    <MenuItem onClick={handleShowDialog}>
      <ListItemIcon>
        <DownloadForOffline />
      </ListItemIcon>
      <ListItemText>{t('Cached chapters')}</ListItemText>
    </MenuItem>
  );
};

export default CachedChaptersMenuItem;
