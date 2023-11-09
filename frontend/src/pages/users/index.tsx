import { useMemo } from 'react';
import { useUsersGetAllQuery } from '../../api/api';
import LoadingWrapper from '../../components/common/LoadingWrapper';
import useTitle from '../../hooks/useTitle';
import User from './User';
import useSearchMatcher from '../../hooks/useSearchMatcher';
import EmptyListWrapper from '../../components/common/EmptyListWrapper';

const Users: React.FC = () => {
  useTitle('Users');
  const searchMatcher = useSearchMatcher();

  const { data = [], isLoading, isError } = useUsersGetAllQuery();

  const users = useMemo(() => {
    if (!searchMatcher) return data;

    return data.filter(
      ({ id, login, name }) => searchMatcher(id, { equels: true }) || searchMatcher(login) || searchMatcher(name)
    );
  }, [data, searchMatcher]);

  return (
    <LoadingWrapper loading={isLoading} error={isError}>
      <EmptyListWrapper wrap={users.length === 0} message={searchMatcher ? 'No users found' : 'No users'}>
        {users.map(user => (
          <User key={user.id} {...user} />
        ))}
      </EmptyListWrapper>
    </LoadingWrapper>
  );
};

export default Users;
