import { useState } from 'react';
import { Button, FormControl, TextField } from '@mui/material';
import CustomPassword from '../../components/common/CustomPassword';
import { useAuthLoginMutation } from '../../api/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../store';
import { setAuthToken } from '../../store/features/auth';
import { CommonAuthProps } from '.';

const PasswordAuthForm: React.FC<CommonAuthProps> = ({ setLoading, setError }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const [auth] = useAuthLoginMutation();

  const handleLogin = async () => {
    setLoading(true);
    setError(undefined);
    try {
      const { access_token } = await auth({ loginBodyDto: { login, password } }).unwrap();
      dispatch(setAuthToken(access_token));
      navigate(pathname, { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Authorization failed');
    }
    setLoading(false);
  };

  return (
    <FormControl fullWidth>
      <TextField
        label='Login'
        value={login}
        onChange={({ target: { value } }) => setLogin(value)}
        required
        error={!login}
      />
      <CustomPassword label='Password' value={password} onChange={setPassword} required error={!password} />
      <Button size='large' variant='contained' sx={{ mt: 1 }} disabled={!login || !password} onClick={handleLogin}>
        Login
      </Button>
    </FormControl>
  );
};

export default PasswordAuthForm;
