import { FC, useState } from 'react';
import useTitle from '../../hooks/useTitle';
import AddFriendToolbar from './AddFriendToolbar';
import IncomingRequests from './IncomingRequests';
import { Tab, Tabs } from '@mui/material';
import OutgoingRequests from './OutgoingRequests';
import { useFriendsGetIncomingRequestsQuery, useFriendsGetOutgoingRequestsQuery } from '../../api/api';
import LoadingWrapper from '../../components/common/LoadingWrapper';
import FriendsBage from '../../components/FriendsBage';

const Friends: FC = () => {
  useTitle('Friends');

  const [tab, setTab] = useState<'in' | 'out'>('in');
  const { data: incoming, isLoading: incomingLoading, isError: incomingError } = useFriendsGetIncomingRequestsQuery();
  const { data: outgoing, isLoading: outgoingLoading, isError: outgoingError } = useFriendsGetOutgoingRequestsQuery();

  const loading = incomingLoading || outgoingLoading;
  const error = incomingError || outgoingError;

  return (
    <>
      <AddFriendToolbar />
      <LoadingWrapper loading={loading} error={error}>
        <Tabs value={tab} onChange={(_, newTab) => setTab(newTab)}>
          <Tab
            label='Incoming requests'
            value='in'
            icon={<FriendsBage friendsRequests={incoming?.length} ml={1} />}
            iconPosition='end'
          />
          {(tab === 'out' || outgoing?.length) && <Tab label='Outgoing requests' value='out' />}
        </Tabs>
        {tab === 'in' && <IncomingRequests />}
        {tab === 'out' && <OutgoingRequests />}
      </LoadingWrapper>
    </>
  );
};

export default Friends;
