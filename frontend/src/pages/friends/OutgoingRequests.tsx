import { FC } from 'react';
import { useFriendsGetOutgoingRequestsQuery } from '../../api/api';
import FriendsList from './FriendsList';

const OutgoingRequests: FC = () => {
  const { data = [], isLoading, isError } = useFriendsGetOutgoingRequestsQuery();

  return <FriendsList data={data} isLoading={isLoading} isError={isError} emptyMessage='No requests' />;
};

export default OutgoingRequests;
