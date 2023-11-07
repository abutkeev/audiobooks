import { FC } from 'react';
import { useFriendsGetQuery, useFriendsRemoveMutation } from '../../api/api';
import FriendsList from './FriendsList';

const FriendsTab: FC = () => {
  const { data = [], isLoading, isError, isFetching } = useFriendsGetQuery();
  const [remove] = useFriendsRemoveMutation();

  const getRemoveHandler = (entryId: string) => async () => {
    await remove({ entryId });
  };

  return (
    <FriendsList
      data={data}
      isLoading={isLoading}
      isError={isError}
      emptyMessage='No friends'
      actions={[
        {
          action: getRemoveHandler,
          actionText: 'Remove',
          refreshing: isFetching,
          progressButtonProps: { color: 'error' },
        },
      ]}
    />
  );
};

export default FriendsTab;
