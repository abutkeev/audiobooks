import { useParams } from 'react-router-dom';
import { useBooksGetBookInfoQuery } from '../../api/api';
import LoadingWrapper from '../../components/common/LoadingWrapper';
import useTitle from '../../hooks/useTitle';
import EditBookInfo from './EditBookInfo';

const EditBookPage: React.FC = () => {
  const { id = '' } = useParams();
  const { data: { info, chapters = [] } = {}, isLoading, isError } = useBooksGetBookInfoQuery({ id });
  useTitle(`Edit ${info?.name || ''}`);

  return (
    <LoadingWrapper loading={isLoading} error={isError}>
      {info && <EditBookInfo id={id} info={info} chapters={chapters} />}
    </LoadingWrapper>
  );
};

export default EditBookPage;
