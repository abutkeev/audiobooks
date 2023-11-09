import { FC } from 'react';
import {
  ChatDto,
  useTelegramAuthorizeChatMutation,
  useTelegramRemoveChatMutation,
  useTelegramUnauthorizeChatMutation,
} from '../../api/api';
import { Paper, Stack, Typography } from '@mui/material';
import ChatType from './ChatType';
import ChatStatus from './ChatStatus';
import CustomSwitch, { CustomSwitchProps } from '../../components/common/CustomSwitch';
import DeleteButton from '../../components/common/DeleteButton';

const ChatEntry: FC<ChatDto> = ({ id, type, title, status, authorized }) => {
  const [authorize] = useTelegramAuthorizeChatMutation();
  const [unauthorize] = useTelegramUnauthorizeChatMutation();
  const [remove] = useTelegramRemoveChatMutation();

  const handleChangeAuthorize: CustomSwitchProps['onChange'] = async newState => {
    if (newState) {
      await authorize({ id });
      return;
    }
    await unauthorize({ id });
  };

  const handleRemove = async () => {
    await remove({ id });
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
        <DeleteButton
          onConfirm={handleRemove}
          confirmationTitle='Remove chat?'
          confirmationBody={`Remove chat ${title}?`}
        />
      </Stack>
    </Paper>
  );
};

export default ChatEntry;
