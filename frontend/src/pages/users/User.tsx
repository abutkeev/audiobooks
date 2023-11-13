import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  FormControl,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { UserDto, useUsersRemoveMutation, useUsersUpdateMutation } from '../../api/api';
import CustomPassword from '../../components/common/CustomPassword';
import useAuthData from '../../hooks/useAuthData';
import UserDisableSwitch from './UserDisableSwitch';
import AdminSwitch from './AdminSwitch';
import DeleteButton from '../../components/common/DeleteButton';
import { useState } from 'react';
import useUpdatingState from '../../hooks/useUpdatingState';
import ProgressButton from '../../components/common/ProgressButton';
import { useAppDispatch } from '../../store';
import { addSnackbar } from '../../store/features/snackbars';
import getErrorMessage from '../../utils/getErrorMessage';
import LoginTextField from '../../components/login-text-field/LoginTextField';

const User: React.FC<UserDto> = ({ id, login, name, enabled, admin }) => {
  const auth = useAuthData();
  const dispatch = useAppDispatch();
  const [newLogin, setNewLogin] = useUpdatingState(login);
  const [loginValid, setLoginValid] = useState(true);
  const [newName, setNewName] = useUpdatingState(name);
  const [password, setPassword] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [update] = useUsersUpdateMutation();
  const [remove] = useUsersRemoveMutation();

  const thisUser = auth?.id === id;

  const modified = newLogin !== login || newName !== name || !!password;

  const handleUpdate = async () => {
    try {
      await update({ id, updateUserDto: { login: newLogin, name: newName, password } }).unwrap();
      setPassword('');
    } catch (e) {
      dispatch(addSnackbar({ severity: 'error', text: getErrorMessage(e, 'User edit failed') }));
    }
  };

  const handleCancel = () => {
    setNewLogin(login);
    setNewName(name);
    setPassword('');
  };

  const handleRemove = async () => {
    try {
      await remove({ id }).unwrap();
    } catch (e) {
      dispatch(addSnackbar({ severity: 'error', text: getErrorMessage(e, 'User remove failed') }));
    }
  };

  const formatUser = () => `${login} ${name && ` (${name})`}`;

  return (
    <Accordion expanded={expanded || modified} onChange={(_, v) => setExpanded(v || modified)}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Stack direction='row' flexGrow={1} alignItems='center'>
          <Typography flexGrow={1} noWrap>
            {formatUser()}
          </Typography>
          <UserDisableSwitch id={id} thisUser={thisUser} admin={admin} enabled={enabled} />
          {!thisUser && (
            <DeleteButton
              confirmationTitle='Remove user?'
              confirmationBody={`Remove user ${formatUser()}`}
              onConfirm={handleRemove}
            />
          )}
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <FormControl fullWidth>
          <Stack spacing={2}>
            <Typography variant='body2'>ID: {id}</Typography>
            <TextField label='Name' value={newName} onChange={({ target: { value } }) => setNewName(value)} />
            <LoginTextField
              login={newLogin}
              setLogin={setNewLogin}
              valid={loginValid}
              setValid={setLoginValid}
              validType='unused'
              allowSelf
              selfLogin={login}
            />
            <CustomPassword label='Password' value={password} onChange={setPassword} />
            <AdminSwitch id={id} thisUser={thisUser} admin={admin} enabled={enabled} />
          </Stack>
        </FormControl>
      </AccordionDetails>
      {modified && (
        <AccordionActions>
          <Stack direction='row' spacing={1}>
            <Button variant='outlined' onClick={handleCancel}>
              Cancel
            </Button>
            <ProgressButton disabled={!loginValid} onClick={handleUpdate}>
              Update
            </ProgressButton>
          </Stack>
        </AccordionActions>
      )}
    </Accordion>
  );
};

export default User;
