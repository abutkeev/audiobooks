import { MouseEventHandler } from 'react';
import { AdminPanelSettings, Shield } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { useUsersActivateMutation, useUsersDeactivateMutation, useUsersGetAllQuery } from '../../api/api';
import CustomSwitch from '../../components/common/CustomSwitch';
import { useTranslation } from 'react-i18next';

interface UserDisableSwitchProps {
  id: string;
  enabled?: boolean;
  admin?: boolean;
  thisUser: boolean;
}

const UserDisableSwitch: React.FC<UserDisableSwitchProps> = ({ thisUser, admin, enabled, id }) => {
  const { t } = useTranslation();
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
      <Tooltip title={t('This user')}>
        <AdminPanelSettings sx={{ mr: 1 }} />
      </Tooltip>
    );
  }

  if (admin) {
    return (
      <Tooltip title={t('Admin')}>
        <Shield sx={{ mr: 2 }} />
      </Tooltip>
    );
  }

  return (
    <CustomSwitch
      tooltip={enabled ? t('Disable') : t('Enable')}
      checked={enabled}
      onClick={handleSwitchClick}
      refreshing={isFetching}
    />
  );
};

export default UserDisableSwitch;
