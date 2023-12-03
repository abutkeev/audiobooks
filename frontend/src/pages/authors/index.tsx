import { useAuthorsGetQuery } from '@/api/api';
import EmptyListWrapper from '@/components/common/EmptyListWrapper';
import LoadingWrapper from '@/components/common/LoadingWrapper';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import AuthorItem from './AuthorItem';
import useTitle from '@/hooks/useTitle';

const Authors: FC = () => {
  const { data: authors = [], isLoading, isError } = useAuthorsGetQuery();
  const { t } = useTranslation();
  useTitle(t('Authors'));

  return (
    <LoadingWrapper loading={isLoading} error={isError}>
      <EmptyListWrapper wrap={authors.length === 0} message={t('No authors')}>
        {authors.map(item => (
          <AuthorItem key={item.id} item={item} />
        ))}
      </EmptyListWrapper>
    </LoadingWrapper>
  );
};

export default Authors;
