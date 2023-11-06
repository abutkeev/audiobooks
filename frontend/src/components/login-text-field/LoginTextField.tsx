import { FC, useEffect, useState } from 'react';
import { InputAdornment, TextField } from '@mui/material';
import { useLazySignUpCheckQuery } from '../../api/api';
import LoginCheckState, { LoginCheckStateProps } from './LoginCheckState';
import debounce from 'debounce';

interface LoginTextFieldProps {
  login: string;
  setLogin(v: string): void;
  valid: boolean;
  setValid(v: boolean): void;
}

const LoginTextField: FC<LoginTextFieldProps> = ({ login, setLogin, valid, setValid }) => {
  const [check] = useLazySignUpCheckQuery();
  const [state, setState] = useState<LoginCheckStateProps['state']>();

  useEffect(() => {
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
        setValid(result);
        setState(result ? 'unused' : 'used');
      } catch {
        setState(undefined);
        setValid(true);
      }
    }, 500);
    debounced();
    return debounced.clear;
  }, [login]);

  return (
    <TextField
      autoFocus
      label='Login'
      value={login}
      onChange={({ target: { value } }) => setLogin(value)}
      required
      error={!valid && state !== 'waiting' && state !== 'checking'}
      helperText={state === 'used' && 'Login is used'}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <LoginCheckState state={state} />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default LoginTextField;
