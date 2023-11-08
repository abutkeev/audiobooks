import { FC } from 'react';
import { ChatDto } from '../../api/api';
import { Paper, Stack, Switch, Typography } from '@mui/material';
import ChatType from './ChatType';
import ChatStatus from './ChatStatus';

const ChatEntry: FC<ChatDto> = ({ type, title, status, authorized }) => {
  return (
    <Paper square variant='outlined'>
      <Stack spacing={1} direction='row' p={1} alignItems='center'>
        <ChatType type={type} />
        <ChatStatus status={status} />
        <Typography noWrap flexGrow={1}>
          {title}
        </Typography>
        <Switch disabled checked={authorized} />
      </Stack>
    </Paper>
  );
};

export default ChatEntry;
