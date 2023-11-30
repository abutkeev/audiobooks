import { FC } from 'react';
import useTitle from '@/hooks/useTitle';
import { useTelegramGetChatsQuery } from '@/api/api';
import LoadingWrapper from '@/components/common/LoadingWrapper';
import EmptyListWrapper from '@/components/common/EmptyListWrapper';
import ChatEntry from './ChatEntry';
import { useTranslation } from 'react-i18next';

const Chats: FC = () => {
  const { t } = useTranslation();
  useTitle(t('Chats'));
  const { data = [], isLoading, isError } = useTelegramGetChatsQuery();

  const chats = data;

  return (
    <LoadingWrapper loading={isLoading} error={isError}>
      <EmptyListWrapper wrap={chats.length === 0} message={t('No chats')}>
        {chats.map(chat => (
          <ChatEntry key={chat.id} {...chat} />
        ))}
      </EmptyListWrapper>
    </LoadingWrapper>
  );
};

export default Chats;
