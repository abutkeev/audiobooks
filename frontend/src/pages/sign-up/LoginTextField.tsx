import { FC, useEffect } from 'react';
import { TextField } from '@mui/material';

interface LoginTextFieldProps {
  login: string;
  setLogin(v: string): void;
  valid: boolean;
  setValid(v: boolean): void;
}

const LoginTextField: FC<LoginTextFieldProps> = ({ login, setLogin, valid, setValid }) => {
  useEffect(() => {
    setValid(!!login);
  }, [login]);

  return (
    <TextField
      autoFocus
      label='Login'
      value={login}
      onChange={({ target: { value } }) => setLogin(value)}
      required
      error={!valid}
    />
  );
};

export default LoginTextField;
