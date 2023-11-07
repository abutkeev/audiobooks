import { FC, useState } from 'react';
import useTitle from '../../hooks/useTitle';
import AddFriendToolbar from './AddFriendToolbar';
import IncomingRequests from './IncomingRequests';
import { Tab, Tabs } from '@mui/material';
import OutgoingRequests from './OutgoingRequests';

const Friends: FC = () => {
  useTitle('Friends');

  const [tab, setTab] = useState<'in' | 'out'>('in');

  return (
    <>
      <AddFriendToolbar />
      <Tabs value={tab} onChange={(_, newTab) => setTab(newTab)}>
        <Tab label='Incoming requests' value='in' />
        <Tab label='Outgoing requests' value='out' />
      </Tabs>
      {tab === 'in' && <IncomingRequests />}
      {tab === 'out' && <OutgoingRequests />}
    </>
  );
};

export default Friends;
