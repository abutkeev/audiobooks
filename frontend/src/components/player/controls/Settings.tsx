import ControlButton from './ControlButton';
import { ChangeEvent, useState } from 'react';
import { FormControlLabel, Menu, MenuItem, Switch } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import useWakeLock from '../../../hooks/useWakeLock';
import copy from 'copy-to-clipboard';
import { Clear, ContentCopy, FileDownload, Update } from '@mui/icons-material';
import UpdateStateDialog from './UpdateStateDialog';
import { useAppDispatch, useAppSelector } from '../../../store';
import { addSnackbar } from '../../../store/features/snackbars';
import CustomDialog from '../../common/CustomDialog';
import useChaptersCacheInfo from '../chapters/useChaptersCacheInfo';
import { addMediaToCache, removeCachedMedia } from '../../../store/features/media-cache';
import { setPreventScreenLock, setResetSleepTimerOnActivity } from '../../../store/features/player';

const Settings: React.FC = () => {
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
    dispatch(addSnackbar({ severity: 'success', text: 'Copied to clipboard', timeout: 2000 }));
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
            label='reset sleep timer on activity'
          />
        </MenuItem>
        {wakelockAvailable && (
          <MenuItem>
            <FormControlLabel
              control={<Switch checked={preventScreenLock} color='primary' onChange={handlePreventScreenLock} />}
              label='prevent screen lock when playing'
            />
          </MenuItem>
        )}
        <MenuItem onClick={handleStateCopy}>
          <ContentCopy sx={theme => ({ color: theme.palette.primary.main, mr: 3 })} />
          copy state
        </MenuItem>
        <MenuItem onClick={handleUpdateStateDialogOpen}>
          <Update sx={theme => ({ color: theme.palette.primary.main, mr: 3 })} />
          update state
        </MenuItem>
        {chaptersCacheInfo.available && !chaptersCacheInfo.all && !chaptersCacheInfo.downloading && (
          <MenuItem onClick={handelStartDownload}>
            <FileDownload sx={theme => ({ color: theme.palette.primary.main, mr: 3 })} />
            cache all chapters
          </MenuItem>
        )}
        {chaptersCacheInfo.available && chaptersCacheInfo.cached !== 0 && !chaptersCacheInfo.downloading && (
          <MenuItem onClick={handleClearCacheMenuClick}>
            <Clear sx={theme => ({ color: theme.palette.primary.main, mr: 3 })} />
            clear cached chapters
          </MenuItem>
        )}
      </Menu>
      <UpdateStateDialog show={showUpdateStateDialog} onClose={() => setShowUpdateStateDialog(false)} />
      <CustomDialog
        title='Clear cache confirmation'
        open={showClearCacheConfirmation}
        content='Clear all cached chapters?'
        confirmButtonProps={{ color: 'error' }}
        close={() => setShowClearCacheConfirmation(false)}
        onConfirm={() => chaptersCacheInfo.available && dispatch(removeCachedMedia(chaptersCacheInfo.keys))}
      />
    </>
  );
};

export default Settings;
