import { FC, ReactNode, useMemo } from 'react';
import LoadingWrapper from '../../components/common/LoadingWrapper';
import EmptyListWrapper from '../../components/common/EmptyListWrapper';
import useSearchMatcher from '../../hooks/useSearchMatcher';
import { Paper, Stack, Typography } from '@mui/material';
import ProgressButton, { ProgressButtonProps } from '../../components/common/ProgressButton';

interface Action {
  action(id: string): ProgressButtonProps['onClick'];
  actionText: ReactNode;
  refreshing?: boolean;
  progressButtonProps?: ProgressButtonProps;
}

interface FriendsListProps {
  data?: { id: string; uid: string; login?: string; name?: string }[];
  isLoading: boolean;
  isError: boolean;
  emptyMessage: string;
  actions?: Action[];
}

const FriendsList: FC<FriendsListProps> = ({ data = [], isLoading, isError, emptyMessage, actions = [] }) => {
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
      <EmptyListWrapper wrap={requests.length === 0} message={searchMatcher ? `${emptyMessage} found` : emptyMessage}>
        {requests.map(({ id, name, login, uid }) => {
          const getDisplayName = () => {
            if (name && name !== login) return `${name} (${login})`;

            if (login) return login;

            return uid;
          };
          return (
            <Paper square variant='outlined' key={id}>
              <Stack spacing={1} direction='row' p={1}>
                <Typography noWrap flexGrow={1}>
                  {getDisplayName()}
                </Typography>
                {actions.map(({ action, refreshing, actionText, progressButtonProps }, index) => (
                  <ProgressButton
                    key={index}
                    onClick={action(id)}
                    refreshing={refreshing}
                    variant='contained'
                    {...progressButtonProps}
                  >
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
