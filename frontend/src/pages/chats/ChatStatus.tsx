import { Accessible, LiveHelp, Logout, Person, VerifiedUser } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { FC } from 'react';

const ChatStatus: FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'member':
      return <Person />;
    case 'administrator':
      return <VerifiedUser />;
    case 'restricted':
      return <Accessible />;
    case 'left':
      return <Logout />;
    default:
      return (
        <Tooltip title={status}>
          <LiveHelp />
        </Tooltip>
      );
  }
};

export default ChatStatus;
