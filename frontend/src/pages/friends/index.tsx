import { FC, useState } from 'react';
import useTitle from '../../hooks/useTitle';
import AddFriendToolbar from './AddFriendToolbar';
import IncomingRequests from './IncomingRequests';
import { Tab, Tabs } from '@mui/material';
import OutgoingRequests from './OutgoingRequests';
import { useFriendsGetIncomingRequestsQuery, useFriendsGetOutgoingRequestsQuery } from '../../api/api';
import LoadingWrapper from '../../components/common/LoadingWrapper';
import FriendsBage from '../../components/FriendsBage';
import FriendsTab from './FriendsTab';
import { useTranslation } from 'react-i18next';

const Friends: FC = () => {
  const { t } = useTranslation();
  useTitle(t('Friends'));

  const [tab, setTab] = useState<'in' | 'out' | 'friends' | 'default'>('default');
  const { data: incoming, isLoading: incomingLoading, isError: incomingError } = useFriendsGetIncomingRequestsQuery();
  const { data: outgoing, isLoading: outgoingLoading, isError: outgoingError } = useFriendsGetOutgoingRequestsQuery();

  const loading = incomingLoading || outgoingLoading;
  const error = incomingError || outgoingError;

  const defaultTab = incoming?.length ? 'in' : 'friends';

  return (
    <>
      <AddFriendToolbar />
      <LoadingWrapper loading={loading} error={error}>
        {(!!incoming?.length || !!outgoing?.length || (tab !== 'default' && tab !== 'friends')) && (
          <Tabs value={tab === 'default' ? defaultTab : tab} onChange={(_, newTab) => setTab(newTab)}>
            {(tab === 'in' || incoming?.length) && (
              <Tab
                label={t('Incoming requests')}
                value='in'
                icon={<FriendsBage friendsRequests={incoming?.length} ml={1} />}
                iconPosition='end'
              />
            )}
            <Tab label={t('Friends')} value='friends' />
            {(tab === 'out' || outgoing?.length) && <Tab label={t('Outgoing requests')} value='out' />}
          </Tabs>
        )}
        {(tab === 'in' || (!!incoming?.length && tab === 'default')) && <IncomingRequests />}
        {(tab === 'friends' || (!incoming?.length && tab === 'default')) && <FriendsTab />}
        {tab === 'out' && <OutgoingRequests />}
      </LoadingWrapper>
    </>
  );
};

export default Friends;
