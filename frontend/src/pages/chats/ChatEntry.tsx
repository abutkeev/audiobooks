import { FC } from 'react';
import { ChatDto, useTelegramAuthorizeChatMutation, useTelegramUnauthorizeChatMutation } from '../../api/api';
import { Paper, Stack, Typography } from '@mui/material';
import ChatType from './ChatType';
import ChatStatus from './ChatStatus';
import CustomSwitch, { CustomSwitchProps } from '../../components/common/CustomSwitch';

const ChatEntry: FC<ChatDto> = ({ id, type, title, status, authorized }) => {
  const [authorize] = useTelegramAuthorizeChatMutation();
  const [unauthorize] = useTelegramUnauthorizeChatMutation();

  const handleChangeAuthorize: CustomSwitchProps['onChange'] = async newState => {
    if (newState) {
      await authorize({ id });
      return;
    }
    await unauthorize({ id });
  };

  return (
    <Paper square variant='outlined'>
      <Stack spacing={1} direction='row' p={1} alignItems='center'>
        <ChatType type={type} />
        <ChatStatus status={status} />
        <Typography noWrap flexGrow={1}>
          {title}
        </Typography>
        <CustomSwitch
          tooltip={authorized ? 'Unauthorize' : 'Authorize'}
          checked={authorized}
          onChange={handleChangeAuthorize}
        />
      </Stack>
    </Paper>
  );
};

export default ChatEntry;
