import { FC } from 'react';
import { useFriendsGetOutgoingRequestsQuery, useFriendsRemoveOutgoingRequestMutation } from '@/api/api';
import FriendsList from './FriendsList';
import { useTranslation } from 'react-i18next';

const OutgoingRequests: FC = () => {
  const { t } = useTranslation();
  const { data = [], isLoading, isError, isFetching } = useFriendsGetOutgoingRequestsQuery();
  const [remove] = useFriendsRemoveOutgoingRequestMutation();

  const getRemoveHandler = (id: string) => async () => {
    await remove({ id });
  };

  return (
    <FriendsList
      data={data}
      isLoading={isLoading}
      isError={isError}
      emptyMessage={t('No requests')}
      notFoundMessage={t('No requests found')}
      actions={[
        {
          action: getRemoveHandler,
          actionText: t('Remove'),
          refreshing: isFetching,
          progressButtonProps: { buttonProps: { color: 'error' } },
        },
      ]}
    />
  );
};

export default OutgoingRequests;
