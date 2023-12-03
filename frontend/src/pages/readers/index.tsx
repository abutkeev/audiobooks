import { useReadersGetQuery } from '@/api/api';
import EmptyListWrapper from '@/components/common/EmptyListWrapper';
import LoadingWrapper from '@/components/common/LoadingWrapper';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import ReaderItem from './ReaderItem';
import useTitle from '@/hooks/useTitle';

const Readers: FC = () => {
  const { data: readers = [], isLoading, isError } = useReadersGetQuery();
  const { t } = useTranslation();
  useTitle(t('Readers'));

  return (
    <LoadingWrapper loading={isLoading} error={isError}>
      <EmptyListWrapper wrap={readers.length === 0} message={t('No readers')}>
        {readers.map(item => (
          <ReaderItem key={item.id} item={item} />
        ))}
      </EmptyListWrapper>
    </LoadingWrapper>
  );
};

export default Readers;
