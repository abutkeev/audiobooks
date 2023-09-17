import jwtDecode from 'jwt-decode';
import { useAppSelector } from '../store';

const useAuthData = () => {
  const { token } = useAppSelector(({ auth }) => auth);

  if (!token) return undefined;

  const result = jwtDecode(token);

  if (
    result &&
    typeof result === 'object' &&
    'username' in result &&
    typeof result.username === 'string' &&
    'sub' in result &&
    typeof result.sub === 'string'
  ) {
    return {
      id: result.sub,
      login: result.username,
    };
  }
};

export default useAuthData;
