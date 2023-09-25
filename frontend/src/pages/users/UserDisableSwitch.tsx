import { AdminPanelSettings, Shield } from '@mui/icons-material';
import { Switch, Tooltip } from '@mui/material';

interface UserDisableSwitchProps {
  id: string;
  enabled?: boolean;
  admin?: boolean;
  thisUser: boolean;
}

const UserDisableSwitch: React.FC<UserDisableSwitchProps> = ({ thisUser, admin, enabled }) => {
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
        <Switch disabled checked={enabled} />
      </div>
    </Tooltip>
  );
};

export default UserDisableSwitch;
