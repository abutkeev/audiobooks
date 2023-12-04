import { FC, useEffect, useMemo, useState } from 'react';
import { InputAdornment, TextField, TextFieldProps } from '@mui/material';
import { useLazySignUpCheckQuery } from '@/api/api';
import LoginCheckState, { LoginCheckStateProps } from './LoginCheckState';
import useAuthData from '@/hooks/useAuthData';
import { useTranslation } from 'react-i18next';
import { debounce } from 'throttle-debounce';

interface LoginTextFieldProps {
  login: string;
  setLogin(v: string): void;
  valid: boolean;
  setValid(v: boolean): void;
  validType: 'used' | 'unused';
  selfLogin?: string;
  allowSelf?: boolean;
  textFieldProps?: TextFieldProps;
}

const LoginTextField: FC<LoginTextFieldProps> = ({
  login,
  setLogin,
  valid,
  setValid,
  validType = 'unused',
  selfLogin: selfLoginProp,
  allowSelf,
  textFieldProps,
}) => {
  const { t } = useTranslation();
  const [check] = useLazySignUpCheckQuery();
  const [state, setState] = useState<LoginCheckStateProps['state']>();
  const { login: authLogin } = useAuthData() || {};

  const selfLogin = selfLoginProp || authLogin;

  useEffect(() => {
    const isLoginValid = (free: boolean) => {
      return validType === 'unused' ? free : !free;
    };

    if (!login) {
      setState(undefined);
      setValid(false);
      return;
    }

    if (selfLogin && login === selfLogin) {
      setState('self');
      setValid(!!allowSelf);
      return;
    }

    setState('waiting');
    setValid(false);
    const debounced = debounce(500, async () => {
      setState('checking');
      try {
        const result = await check({ login }).unwrap();
        setValid(isLoginValid(result));
        setState(result ? 'unused' : 'used');
      } catch {
        setState(undefined);
        setValid(true);
      }
    });
    debounced();
    return debounced.cancel;
  }, [login, validType, allowSelf, check, selfLogin, setValid]);

  const helperText = useMemo(() => {
    if (validType === 'unused' && state === 'used') {
      return t('Login is used');
    }

    if (validType === 'used' && state === 'unused') {
      return t('User not found');
    }

    if (state === 'self' && !allowSelf) {
      return t('Self login');
    }
  }, [state, validType, t, allowSelf]);

  return (
    <TextField
      autoFocus
      label={t('Login')}
      value={login}
      onChange={({ target: { value } }) => setLogin(value)}
      required
      error={!valid && state !== 'waiting' && state !== 'checking'}
      helperText={helperText}
      {...textFieldProps}
      InputProps={{
        ...textFieldProps?.InputProps,
        endAdornment: (
          <InputAdornment position='end'>
            <LoginCheckState state={state} validType={validType} />
            {textFieldProps?.InputProps?.endAdornment}
          </InputAdornment>
        ),
      }}
    />
  );
};

export default LoginTextField;
