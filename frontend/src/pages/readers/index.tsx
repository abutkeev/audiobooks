import { useReadersGetQuery } from '@/api/api';
import EmptyListWrapper from '@/components/common/EmptyListWrapper';
import LoadingWrapper from '@/components/common/LoadingWrapper';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ReaderItem from './ReaderItem';
import useTitle from '@/hooks/useTitle';
import useSearchMatcher from '@/hooks/useSearchMatcher';

const Readers: FC = () => {
  const { data = [], isLoading, isError } = useReadersGetQuery();
  const { t } = useTranslation();
  useTitle(t('Readers'));
  const searchMatcher = useSearchMatcher();

  const readers = useMemo(() => {
    if (!searchMatcher) return data;

    return data.filter(({ id, name }) => searchMatcher(id, { equels: true }) || searchMatcher(name));
  }, [data, searchMatcher]);

  return (
    <LoadingWrapper loading={isLoading} error={isError}>
      <EmptyListWrapper wrap={readers.length === 0} message={searchMatcher ? t('No readers found') : t('No readers')}>
        {readers.map(item => (
          <ReaderItem key={item.id} item={item} />
        ))}
      </EmptyListWrapper>
    </LoadingWrapper>
  );
};

export default Readers;
