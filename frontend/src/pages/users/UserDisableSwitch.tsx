import { MouseEventHandler } from 'react';
import { AdminPanelSettings, Shield } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { useUsersActivateMutation, useUsersDeactivateMutation, useUsersGetAllQuery } from '../../api/api';
import CustomSwitch from '../../components/common/CustomSwitch';

interface UserDisableSwitchProps {
  id: string;
  enabled?: boolean;
  admin?: boolean;
  thisUser: boolean;
}

const UserDisableSwitch: React.FC<UserDisableSwitchProps> = ({ thisUser, admin, enabled, id }) => {
  const { isFetching } = useUsersGetAllQuery();
  const [activate] = useUsersActivateMutation();
  const [deactivate] = useUsersDeactivateMutation();

  const handleSwitchClick: MouseEventHandler = async e => {
    e.stopPropagation();
    if (enabled) {
      await deactivate({ id });
      return;
    }

    await activate({ id });
  };

  if (thisUser) {
    return (
      <Tooltip title='This user'>
        <AdminPanelSettings sx={{ mr: 1 }} />
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
    <CustomSwitch
      tooltip={enabled ? 'Disable' : 'Enable'}
      checked={enabled}
      onClick={handleSwitchClick}
      refreshing={isFetching}
    />
  );
};

export default UserDisableSwitch;
