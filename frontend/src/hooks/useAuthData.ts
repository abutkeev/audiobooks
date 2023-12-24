import jwtDecode from 'jwt-decode';
import { useAppDispatch, useAppSelector } from '@/store';
import { useEffect } from 'react';
import { useAuthGenerateTokenMutation } from '@/api/api';
import { setAuthToken } from '@/store/features/auth';

export const parseToken = (token: string | null) => {
  if (!token) return undefined;

  const result = jwtDecode(token);

  if (
    result &&
    typeof result === 'object' &&
    'username' in result &&
    typeof result.username === 'string' &&
    'sub' in result &&
    typeof result.sub === 'string' &&
    'exp' in result &&
    typeof result.exp === 'number'
  ) {
    const name = 'name' in result && typeof result.name === 'string' ? result.name : '';
    const enabled = 'enabled' in result && typeof result.enabled === 'boolean' ? result.enabled : false;
    const admin = 'admin' in result && typeof result.admin === 'boolean' ? result.admin : false;
    const exp = new Date(result.exp * 1000);

    return {
      id: result.sub,
      login: result.username,
      name,
      enabled,
      admin,
      exp,
    };
  }
};

let tokenRefreshing = false;

const useAuthData = () => {
  const { token } = useAppSelector(({ auth }) => auth);
  const [refresh] = useAuthGenerateTokenMutation();
  const result = parseToken(token);
  const dispatch = useAppDispatch();

  const needTokenRefresh = !!result && result.exp.getTime() - Date.now() < 2 * 24 * 60 * 60 * 1000;

  useEffect(() => {
    if (!needTokenRefresh || tokenRefreshing) return;

    tokenRefreshing = true;

    refresh()
      .unwrap()
      .then(({ access_token }) => dispatch(setAuthToken(access_token)))
      .finally(() => (tokenRefreshing = false));
  }, [needTokenRefresh, dispatch, refresh]);

  return result;
};

export default useAuthData;
