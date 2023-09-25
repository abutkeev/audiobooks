import { MouseEventHandler } from 'react';
import { AdminPanelSettings, Shield } from '@mui/icons-material';
import { Switch, Tooltip } from '@mui/material';
import { useUsersActivateMutation, useUsersDeactivateMutation } from '../../api/api';

interface UserDisableSwitchProps {
  id: string;
  enabled?: boolean;
  admin?: boolean;
  thisUser: boolean;
}

const UserDisableSwitch: React.FC<UserDisableSwitchProps> = ({ thisUser, admin, enabled, id }) => {
  const [activate] = useUsersActivateMutation();
  const [deactivate] = useUsersDeactivateMutation();

  const handleSwitchClick: MouseEventHandler = e => {
    e.stopPropagation();
    if (enabled) {
      return deactivate({ id }).unwrap();
    }

    return activate({ id }).unwrap;
  };

  if (thisUser) {
    return (
      <Tooltip title='This user'>
        <AdminPanelSettings sx={{ mr: 2 }} />
      </Tooltip>
    );
  }

  if (admin) {
    return (
      <Tooltip title='Admin'>
        <Shield sx={{ mr: 2 }} />
      </Tooltip>
    );
  }

  return (
    <Tooltip title={enabled ? 'Disable' : 'Enable'}>
      <div>
        <Switch checked={enabled} onClick={handleSwitchClick} />
      </div>
    </Tooltip>
  );
};

export default UserDisableSwitch;
