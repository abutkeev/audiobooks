import { FC } from 'react';
import {
  useFriendsApproveRequestMutation,
  useFriendsGetIncomingRequestsQuery,
  useFriendsRemoveIncomingRequestMutation,
} from '../../api/api';
import FriendsList from './FriendsList';
import { useTranslation } from 'react-i18next';

const IncomingRequests: FC = () => {
  const { t } = useTranslation();
  const { data = [], isLoading, isError, isFetching } = useFriendsGetIncomingRequestsQuery();
  const [approve] = useFriendsApproveRequestMutation();
  const [remove] = useFriendsRemoveIncomingRequestMutation();

  const getApproveHandler = (id: string) => async () => {
    await approve({ id });
  };

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
        { action: getApproveHandler, actionText: t('Approve'), refreshing: isFetching },
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

export default IncomingRequests;
