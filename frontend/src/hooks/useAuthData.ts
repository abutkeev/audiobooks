import jwtDecode from 'jwt-decode';
import { useAppSelector } from '@/store';

export const parseToken = (token: string | null) => {
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
    const name = 'name' in result && typeof result.name === 'string' ? result.name : '';
    const enabled = 'enabled' in result && typeof result.enabled === 'boolean' ? result.enabled : false;
    const admin = 'admin' in result && typeof result.admin === 'boolean' ? result.admin : false;

    return {
      id: result.sub,
      login: result.username,
      name,
      enabled,
      admin,
    };
  }
};

const useAuthData = () => {
  const { token } = useAppSelector(({ auth }) => auth);
  return parseToken(token);
};

export default useAuthData;
