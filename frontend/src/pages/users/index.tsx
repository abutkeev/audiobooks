import { useMemo } from 'react';
import { useUsersGetAllQuery } from '../../api/api';
import LoadingWrapper from '../../components/common/LoadingWrapper';
import useTitle from '../../hooks/useTitle';
import User from './User';
import useSearchMatcher from '../../hooks/useSearchMatcher';
import { Alert } from '@mui/material';

const Users: React.FC = () => {
  useTitle('Users');
  const searchMatcher = useSearchMatcher();

  const { data = [], isLoading, isError } = useUsersGetAllQuery();

  const users = useMemo(() => {
    if (!searchMatcher) return data;

    return data.filter(({ id, login }) => searchMatcher(id, { equels: true }) || searchMatcher(login));
  }, [data, searchMatcher]);

  return (
    <LoadingWrapper loading={isLoading} error={isError}>
      {users.length === 0 ? (
        <Alert severity='info'>No users found</Alert>
      ) : (
        users.map(user => <User key={user.id} {...user} />)
      )}
    </LoadingWrapper>
  );
};

export default Users;
