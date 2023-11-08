import { FC } from 'react';
import useTitle from '../../hooks/useTitle';
import { useTelegramGetChatsQuery } from '../../api/api';
import LoadingWrapper from '../../components/common/LoadingWrapper';
import EmptyListWrapper from '../../components/common/EmptyListWrapper';
import ChatEntry from './ChatEntry';

const Chats: FC = () => {
  useTitle('Chats');
  const { data = [], isLoading, isError } = useTelegramGetChatsQuery();

  const chats = data;

  return (
    <LoadingWrapper loading={isLoading} error={isError}>
      <EmptyListWrapper wrap={chats.length === 0} message='No chats'>
        {chats.map(chat => (
          <ChatEntry key={chat.id} {...chat} />
        ))}
      </EmptyListWrapper>
    </LoadingWrapper>
  );
};

export default Chats;
