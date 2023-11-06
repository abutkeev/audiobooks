import { FC, useEffect, useMemo, useState } from 'react';
import { InputAdornment, TextField, TextFieldProps } from '@mui/material';
import { useLazySignUpCheckQuery } from '../../api/api';
import LoginCheckState, { LoginCheckStateProps } from './LoginCheckState';
import debounce from 'debounce';
import useAuthData from '../../hooks/useAuthData';

interface LoginTextFieldProps {
  login: string;
  setLogin(v: string): void;
  valid: boolean;
  setValid(v: boolean): void;
  validType: 'used' | 'unused';
  textFieldProps?: TextFieldProps;
}

const LoginTextField: FC<LoginTextFieldProps> = ({
  login,
  setLogin,
  valid,
  setValid,
  validType = 'unused',
  textFieldProps,
}) => {
  const [check] = useLazySignUpCheckQuery();
  const [state, setState] = useState<LoginCheckStateProps['state']>();
  const { login: selfLogin } = useAuthData() || {};

  useEffect(() => {
    const isLoginValid = (free: boolean) => {
      return validType === 'unused' ? free : !free;
    };

    if (!login) {
      setState(undefined);
      setValid(false);
      return;
    }

    if (validType === 'used' && selfLogin && login === selfLogin) {
      setState('self');
      setValid(false);
      return;
    }

    setState('waiting');
    setValid(false);
    const debounced = debounce(async () => {
      setState('checking');
      try {
        const result = await check({ login }).unwrap();
        setValid(isLoginValid(result));
        setState(result ? 'unused' : 'used');
      } catch {
        setState(undefined);
        setValid(true);
      }
    }, 500);
    debounced();
    return debounced.clear;
  }, [login, validType]);

  const helperText = useMemo(() => {
    if (validType === 'unused' && state === 'used') {
      return 'Login is used';
    }

    if (validType === 'used' && state === 'unused') {
      return 'User not found';
    }

    if (state === 'self') {
      return 'Self login';
    }
  }, [state, valid, validType, selfLogin]);

  return (
    <TextField
      autoFocus
      label='Login'
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
