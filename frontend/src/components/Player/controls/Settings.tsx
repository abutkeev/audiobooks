import ControlButton from './ControlButton';
import { ChangeEvent, useContext, useState } from 'react';
import { FormControlLabel, Menu, MenuItem, Switch } from '@mui/material';
import { PlayerStateContext, setResetSleepTimerOnActivity } from '../usePlayerState';
import SettingsIcon from '@mui/icons-material/Settings';

const Settings: React.FC = () => {
  const [menuAhchor, setMenuAnchor] = useState<HTMLElement>();
  const {
    state: { resetSleepTimerOnActivity },
    dispatch,
  } = useContext(PlayerStateContext);

  const closeMenu = () => setMenuAnchor(undefined);
  const handleResetSleepTimerOnActivityChange = (_: ChangeEvent, checked: boolean) => {
    dispatch(setResetSleepTimerOnActivity(checked));
    setTimeout(closeMenu, 700);
  };

  return (
    <>
      <ControlButton Icon={SettingsIcon} small onClick={e => setMenuAnchor(e.currentTarget)} sx={{ml: 1}} />
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
      </Menu>
    </>
  );
};

export default Settings;
