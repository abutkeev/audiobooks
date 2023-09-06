import ControlButton from './ControlButton';
import { ChangeEvent, useContext, useState } from 'react';
import { FormControlLabel, Menu, MenuItem, Switch } from '@mui/material';
import { PlayerStateContext, setPreventScreenLock, setResetSleepTimerOnActivity } from '../state/usePlayerState';
import SettingsIcon from '@mui/icons-material/Settings';
import useWakeLock from '../useWakeLock';
import copy from 'copy-to-clipboard';
import { ContentCopy, FileDownload, Update } from '@mui/icons-material';
import UpdateStateDialog from './UpdateStateDialog';
import { useAppDispatch } from '../../../store';
import { addSnackbar } from '../../../store/features/snackbars';
import { startDownload } from '../state/useCache';

const Settings: React.FC = () => {
  const [menuAhchor, setMenuAnchor] = useState<HTMLElement>();
  const {
    state: { resetSleepTimerOnActivity, preventScreenLock, playing, position, currentChapter },
    bookId,
    dispatch,
    cache,
  } = useContext(PlayerStateContext);
  const wakelockAvailable = useWakeLock({ preventScreenLock, playing });
  const [showUpdateStateDialog, setShowUpdateStateDialog] = useState(false);
  const appDispatch = useAppDispatch();

  const canDownload = cache.state.filter(entry => !entry).length !== 0;

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
    appDispatch(addSnackbar({ severity: 'success', text: 'Copied to clipboard', timeout: 2000 }));
    closeMenu();
  };
  const handleUpdateStateDialogOpen = () => {
    setShowUpdateStateDialog(true);
    closeMenu();
  };
  const handelStartDownload = () => {
    cache.dispatch(startDownload());
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
        {canDownload && (
          <MenuItem onClick={handelStartDownload}>
            <FileDownload sx={theme => ({ color: theme.palette.primary.main, mr: 3 })} />
            cache all chapters
          </MenuItem>
        )}
      </Menu>
      <UpdateStateDialog show={showUpdateStateDialog} onClose={() => setShowUpdateStateDialog(false)} />
    </>
  );
};

export default Settings;
