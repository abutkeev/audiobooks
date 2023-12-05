import { FC, ReactNode, useMemo } from 'react';
import LoadingWrapper from '@/components/common/LoadingWrapper';
import EmptyListWrapper from '@/components/common/EmptyListWrapper';
import useSearchMatcher from '@/hooks/useSearchMatcher';
import { Paper, Stack, Typography } from '@mui/material';
import ProgressButton, { ProgressButtonProps } from '@/components/common/ProgressButton';
import getFriendDisplayName from '@/utils/getFriendDisplayName';
import UserOnlineIndicator from '@/components/UserOnlineIndicator';

interface Action {
  action(id: string): ProgressButtonProps['onClick'];
  actionText: ReactNode;
  refreshing?: boolean;
  progressButtonProps?: ProgressButtonProps;
}

interface FriendsListProps {
  data?: { id: string; uid: string; login?: string; name?: string; online?: string }[];
  showOnline?: boolean;
  isLoading: boolean;
  isError: boolean;
  emptyMessage: string;
  notFoundMessage: string;
  actions?: Action[];
}

const FriendsList: FC<FriendsListProps> = ({
  data = [],
  showOnline,
  isLoading,
  isError,
  emptyMessage,
  notFoundMessage,
  actions = [],
}) => {
  const searchMatcher = useSearchMatcher();

  const requests = useMemo(() => {
    if (!searchMatcher) return data;

    return data.filter(
      ({ id, uid, login, name }) =>
        searchMatcher(id, { equels: true }) ||
        searchMatcher(uid, { equels: true }) ||
        searchMatcher(login) ||
        searchMatcher(name)
    );
  }, [data, searchMatcher]);

  return (
    <LoadingWrapper loading={isLoading} error={isError}>
      <EmptyListWrapper wrap={requests.length === 0} message={searchMatcher ? notFoundMessage : emptyMessage}>
        {requests.map(({ id, name, login, uid, online }) => {
          return (
            <Paper square variant='outlined' key={id}>
              <Stack spacing={1} direction='row' p={1} alignItems='center'>
                {showOnline && <UserOnlineIndicator online={online} />}
                <Typography noWrap flexGrow={1}>
                  {getFriendDisplayName({ uid, login, name })}
                </Typography>
                {actions.map(({ action, refreshing, actionText, progressButtonProps }, index) => (
                  <ProgressButton key={index} onClick={action(id)} refreshing={refreshing} {...progressButtonProps}>
                    {actionText}
                  </ProgressButton>
                ))}
              </Stack>
            </Paper>
          );
        })}
      </EmptyListWrapper>
    </LoadingWrapper>
  );
};

export default FriendsList;
