import { Add } from '@mui/icons-material';
import { AppBar, Button, Toolbar } from '@mui/material';
import { FC, useState } from 'react';
import CustomDialog, { AbortOperation } from '../../components/common/CustomDialog';
import LoginTextField from '../../components/login-text-field/LoginTextField';
import { useFriendsAddMutation } from '../../api/api';
import { useAppDispatch } from '../../store';
import { addSnackbar } from '../../store/features/snackbars';

const AddFriendToolbar: FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [login, setLogin] = useState('');
  const [loginValid, setLoginValid] = useState(false);
  const dispatch = useAppDispatch();
  const [add] = useFriendsAddMutation();

  const handleClose = () => {
    setShowAddForm(false);
    setLogin('');
    setLoginValid(false);
  };

  const handleSubmit = async () => {
    try {
      await add({ addFriendRequestDto: { login } }).unwrap();
    } catch (e) {
      if (
        e &&
        typeof e === 'object' &&
        'data' in e &&
        e.data &&
        typeof e.data === 'object' &&
        'message' in e.data &&
        e.data.message &&
        typeof e.data.message === 'string'
      ) {
        dispatch(addSnackbar({ severity: 'error', text: e.data.message }));
        throw new AbortOperation();
      }
      dispatch(addSnackbar({ severity: 'error', text: 'got unknown error while adding friend' }));
      throw e;
    }
  };

  return (
    <AppBar position='static' color='default' sx={{ mb: 1 }}>
      <Toolbar>
        <Button
          variant='contained'
          color='primary'
          startIcon={<Add />}
          onClick={() => setShowAddForm(true)}
          disabled={showAddForm}
        >
          Add
        </Button>
      </Toolbar>
      <CustomDialog
        open={showAddForm}
        title='Add friend'
        content={
          <LoginTextField
            login={login}
            setLogin={setLogin}
            valid={loginValid}
            setValid={setLoginValid}
            validType='used'
            textFieldProps={{ sx: { mt: 1 }, fullWidth: true, label: 'Friend login', autoComplete: 'off' }}
          />
        }
        close={handleClose}
        onConfirm={handleSubmit}
        confirmButtonText='Add'
      />
    </AppBar>
  );
};

export default AddFriendToolbar;
