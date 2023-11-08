import { FC } from 'react';
import {
  useFriendsApproveRequestMutation,
  useFriendsGetIncomingRequestsQuery,
  useFriendsRemoveIncomingRequestMutation,
} from '../../api/api';
import FriendsList from './FriendsList';

const IncomingRequests: FC = () => {
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
      emptyMessage='No requests'
      actions={[
        { action: getApproveHandler, actionText: 'Approve', refreshing: isFetching },
        {
          action: getRemoveHandler,
          actionText: 'Remove',
          refreshing: isFetching,
          progressButtonProps: { buttonProps: { color: 'error' } },
        },
      ]}
    />
  );
};

export default IncomingRequests;
