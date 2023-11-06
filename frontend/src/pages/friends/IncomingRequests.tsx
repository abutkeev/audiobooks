import { FC } from 'react';
import { useFriendsGetIncomingRequestsQuery } from '../../api/api';
import FriendsList from './FriendsList';

const IncomingRequests: FC = () => {
  const { data = [], isLoading, isError } = useFriendsGetIncomingRequestsQuery();

  return <FriendsList data={data} isLoading={isLoading} isError={isError} emptyMessage='No requests' />;
};

export default IncomingRequests;
