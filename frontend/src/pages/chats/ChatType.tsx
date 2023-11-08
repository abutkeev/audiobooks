import { Group, Groups, LiveHelp } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { FC } from 'react';

const ChatType: FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'group':
      return <Group />;
    case 'supergroup':
      return <Groups />;
    default:
      return (
        <Tooltip title={type}>
          <LiveHelp />
        </Tooltip>
      );
  }
};

export default ChatType;
