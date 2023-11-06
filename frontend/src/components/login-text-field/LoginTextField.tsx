import { FC, useEffect, useMemo, useState } from 'react';
import { InputAdornment, TextField } from '@mui/material';
import { useLazySignUpCheckQuery } from '../../api/api';
import LoginCheckState, { LoginCheckStateProps } from './LoginCheckState';
import debounce from 'debounce';

interface LoginTextFieldProps {
  login: string;
  setLogin(v: string): void;
  valid: boolean;
  setValid(v: boolean): void;
  validType: 'used' | 'unused';
}

const LoginTextField: FC<LoginTextFieldProps> = ({ login, setLogin, valid, setValid, validType = 'unused' }) => {
  const [check] = useLazySignUpCheckQuery();
  const [state, setState] = useState<LoginCheckStateProps['state']>();

  useEffect(() => {
    const isLoginValid = (free: boolean) => {
      return validType === 'unused' ? free : !free;
    };

    if (!login) {
      setState(undefined);
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
  }, [state, valid, validType]);

  return (
    <TextField
      autoFocus
      label='Login'
      value={login}
      onChange={({ target: { value } }) => setLogin(value)}
      required
      error={!valid && state !== 'waiting' && state !== 'checking'}
      helperText={helperText}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <LoginCheckState state={state} validType={validType} />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default LoginTextField;
