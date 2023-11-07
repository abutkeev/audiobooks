import { FC, useState } from 'react';
import useTitle from '../../hooks/useTitle';
import AddFriendToolbar from './AddFriendToolbar';
import IncomingRequests from './IncomingRequests';
import { Tab, Tabs } from '@mui/material';
import OutgoingRequests from './OutgoingRequests';
import { useFriendsGetIncomingRequestsQuery } from '../../api/api';
import LoadingWrapper from '../../components/common/LoadingWrapper';
import FriendsBage from '../../components/FriendsBage';

const Friends: FC = () => {
  useTitle('Friends');

  const [tab, setTab] = useState<'in' | 'out'>('in');
  const { data, isLoading, isError } = useFriendsGetIncomingRequestsQuery();
  const friendsRequests = data?.length;

  return (
    <>
      <AddFriendToolbar />
      <LoadingWrapper loading={isLoading} error={isError}>
        <Tabs value={tab} onChange={(_, newTab) => setTab(newTab)}>
          <Tab
            label='Incoming requests'
            value='in'
            icon={<FriendsBage friendsRequests={friendsRequests} ml={1} />}
            iconPosition='end'
          />
          <Tab label='Outgoing requests' value='out' />
        </Tabs>
        {tab === 'in' && <IncomingRequests />}
        {tab === 'out' && <OutgoingRequests />}
      </LoadingWrapper>
    </>
  );
};

export default Friends;
