import { MouseEventHandler } from 'react';
import { FormControlLabel, Switch } from '@mui/material';
import { useUsersGrantMutation, useUsersRevokeMutation } from '@/api/api';
import { useTranslation } from 'react-i18next';

interface AdminSwitchSwitchProps {
  id: string;
  enabled?: boolean;
  admin?: boolean;
  thisUser: boolean;
}

const AdminSwitch: React.FC<AdminSwitchSwitchProps> = ({ thisUser, admin, enabled, id }) => {
  const { t } = useTranslation();
  const [grant] = useUsersGrantMutation();
  const [revoke] = useUsersRevokeMutation();

  const handleSwitchClick: MouseEventHandler = e => {
    e.stopPropagation();
    if (admin) {
      return revoke({ id }).unwrap();
    }

    return grant({ id }).unwrap;
  };

  if (thisUser || !enabled) {
    return;
  }

  return <FormControlLabel control={<Switch checked={admin} onClick={handleSwitchClick} />} label={t('Admin')} />;
};

export default AdminSwitch;
