import { FC } from 'react';
import { useFriendsGetQuery, useFriendsRemoveMutation } from '@/api/api';
import FriendsList from './FriendsList';
import { useTranslation } from 'react-i18next';

const FriendsTab: FC = () => {
  const { t } = useTranslation();
  const { data = [], isLoading, isError, isFetching } = useFriendsGetQuery();
  const [remove] = useFriendsRemoveMutation();

  const getRemoveHandler = (entryId: string) => async () => {
    await remove({ entryId });
  };

  return (
    <FriendsList
      data={data}
      showOnline
      isLoading={isLoading}
      isError={isError}
      emptyMessage={t('No friends')}
      notFoundMessage={t('No friends found')}
      actions={[
        {
          action: getRemoveHandler,
          actionText: t('Remove'),
          refreshing: isFetching,
          progressButtonProps: { buttonProps: { color: 'error' } },
        },
      ]}
    />
  );
};

export default FriendsTab;
