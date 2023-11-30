import ControlButton from './ControlButton';
import { ChangeEvent, useState } from 'react';
import { FormControlLabel, Menu, MenuItem, Switch } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import useWakeLock from '@/hooks/useWakeLock';
import copy from 'copy-to-clipboard';
import { Clear, ContentCopy, FileDownload, Update } from '@mui/icons-material';
import UpdateStateDialog from './UpdateStateDialog';
import { useAppDispatch, useAppSelector } from '@/store';
import CustomDialog from '@/components/common/CustomDialog';
import useChaptersCacheInfo from '../chapters/useChaptersCacheInfo';
import { addMediaToCache, removeCachedMedia } from '@/store/features/media-cache';
import { setPreventScreenLock, setResetSleepTimerOnActivity, showMessage } from '@/store/features/player';
import { useTranslation } from 'react-i18next';

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const [menuAhchor, setMenuAnchor] = useState<HTMLElement>();
  const {
    state: { resetSleepTimerOnActivity, preventScreenLock, position, currentChapter },
    bookId,
  } = useAppSelector(({ player }) => player);
  const dispatch = useAppDispatch();
  const wakelockAvailable = useWakeLock();
  const [showUpdateStateDialog, setShowUpdateStateDialog] = useState(false);
  const [showClearCacheConfirmation, setShowClearCacheConfirmation] = useState(false);
  const chaptersCacheInfo = useChaptersCacheInfo();

  const closeMenu = () => setMenuAnchor(undefined);
  const handleResetSleepTimerOnActivityChange = (_: ChangeEvent, checked: boolean) => {
    dispatch(setResetSleepTimerOnActivity(checked));
    setTimeout(closeMenu, 700);
  };
  const handlePreventScreenLock = (_: ChangeEvent, checked: boolean) => {
    dispatch(setPreventScreenLock(checked));
    setTimeout(closeMenu, 700);
  };
  const handleStateCopy = () => {
    copy(JSON.stringify({ bookId, currentChapter, position }, null, 2));
    dispatch(showMessage({ severity: 'success', text: t('Copied to clipboard'), timeout: 2000 }));
    closeMenu();
  };
  const handleUpdateStateDialogOpen = () => {
    setShowUpdateStateDialog(true);
    closeMenu();
  };
  const handelStartDownload = () => {
    dispatch(addMediaToCache(chaptersCacheInfo.keys || []));
    closeMenu();
  };
  const handleClearCacheMenuClick = () => {
    setShowClearCacheConfirmation(true);
    closeMenu();
  };

  return (
    <>
      <ControlButton Icon={SettingsIcon} small onClick={e => setMenuAnchor(e.currentTarget)} sx={{ ml: 1 }} />
      <Menu anchorEl={menuAhchor} open={!!menuAhchor} onClose={closeMenu}>
        <MenuItem>
          <FormControlLabel
            control={
              <Switch
                checked={resetSleepTimerOnActivity}
                color='primary'
                onChange={handleResetSleepTimerOnActivityChange}
              />
            }
            label={t('reset sleep timer on activity')}
          />
        </MenuItem>
        {wakelockAvailable && (
          <MenuItem>
            <FormControlLabel
              control={<Switch checked={preventScreenLock} color='primary' onChange={handlePreventScreenLock} />}
              label={t('prevent screen lock when playing')}
            />
          </MenuItem>
        )}
        <MenuItem onClick={handleStateCopy}>
          <ContentCopy sx={theme => ({ color: theme.palette.primary.main, mr: 3 })} />
          {t('copy state')}
        </MenuItem>
        <MenuItem onClick={handleUpdateStateDialogOpen}>
          <Update sx={theme => ({ color: theme.palette.primary.main, mr: 3 })} />
          {t('update state')}
        </MenuItem>
        {chaptersCacheInfo.available && !chaptersCacheInfo.all && !chaptersCacheInfo.downloading && (
          <MenuItem onClick={handelStartDownload}>
            <FileDownload sx={theme => ({ color: theme.palette.primary.main, mr: 3 })} />
            {t('cache all chapters')}
          </MenuItem>
        )}
        {chaptersCacheInfo.available && chaptersCacheInfo.cached !== 0 && !chaptersCacheInfo.downloading && (
          <MenuItem onClick={handleClearCacheMenuClick}>
            <Clear sx={theme => ({ color: theme.palette.primary.main, mr: 3 })} />
            {t('clear cached chapters')}
          </MenuItem>
        )}
      </Menu>
      <UpdateStateDialog show={showUpdateStateDialog} onClose={() => setShowUpdateStateDialog(false)} />
      <CustomDialog
        title={t('Clear cache confirmation')}
        open={showClearCacheConfirmation}
        content={t('Clear all cached chapters?')}
        confirmButtonProps={{ buttonProps: { color: 'error' } }}
        close={() => setShowClearCacheConfirmation(false)}
        onConfirm={() => void (chaptersCacheInfo.available && dispatch(removeCachedMedia(chaptersCacheInfo.keys)))}
      />
    </>
  );
};

export default Settings;
