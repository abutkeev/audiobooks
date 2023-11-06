import { FC, useState } from 'react';
import useTitle from '../../hooks/useTitle';
import AddFriendToolbar from './AddFriendToolbar';
import IncomingRequests from './IncomingRequests';
import { Tab, Tabs } from '@mui/material';
import OutgoingRequests from './OutgoingRequests';

const Friends: FC = () => {
  useTitle('Friends');
  const [tab, setTab] = useState(0);

  return (
    <>
      <AddFriendToolbar />
      <Tabs value={tab} onChange={(_, newTab) => setTab(newTab)}>
        <Tab label='Incoming requests' value={0} />
        <Tab label='Outgoing requests' value={1}/>
      </Tabs>
      {tab === 0 && <IncomingRequests />}
      {tab === 1 && <OutgoingRequests />}
    </>
  );
};

export default Friends;
