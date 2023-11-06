import { FC } from 'react';
import { useFriendsGetOutgoingRequestsQuery, useFriendsRemoveOutgoingRequestMutation } from '../../api/api';
import FriendsList from './FriendsList';

const OutgoingRequests: FC = () => {
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
      emptyMessage='No requests'
      actions={[{ action: getRemoveHandler, actionText: 'Remove', refreshing: isFetching }]}
    />
  );
};

export default OutgoingRequests;
