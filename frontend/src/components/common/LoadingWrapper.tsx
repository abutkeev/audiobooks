import PageLoadingIndicator from './PageLoadingIndicator';
import ErrorWrapper from './ErrorWrapper';

export interface LoadingWrapperProps {
  loading?: boolean;
  error?: boolean;
}

const LoadingWrapper: React.FC<React.PropsWithChildren<LoadingWrapperProps>> = ({ children, loading, error }) => (
  <ErrorWrapper error={error}>{loading ? <PageLoadingIndicator open /> : children}</ErrorWrapper>
);

export default LoadingWrapper;
