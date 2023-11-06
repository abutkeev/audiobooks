import { FC } from 'react';
import { useFriendsApproveRequestMutation, useFriendsGetIncomingRequestsQuery } from '../../api/api';
import FriendsList from './FriendsList';

const IncomingRequests: FC = () => {
  const { data = [], isLoading, isError, isFetching } = useFriendsGetIncomingRequestsQuery();
  const [approve] = useFriendsApproveRequestMutation();

  const getApproveHandler = (id: string) => async () => {
    await approve({ id });
  };

  return (
    <FriendsList
      data={data}
      isLoading={isLoading}
      isError={isError}
      emptyMessage='No requests'
      actions={[{ action: getApproveHandler, actionText: 'Approve', refreshing: isFetching }]}
    />
  );
};

export default IncomingRequests;
