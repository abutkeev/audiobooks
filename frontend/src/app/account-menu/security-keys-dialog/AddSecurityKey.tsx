import { Button, CircularProgress, Stack, TextField, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { Fingerprint } from '@mui/icons-material';
import { registerSecurityKey, webauthnAvailable } from '../../../utils/webautn';
import { useWebauthnAddMutation, useWebauthnGenerateChallengeMutation } from '../../../api/api';
import useAuthData from '../../../hooks/useAuthData';
import { useAppDispatch } from '../../../store';
import { addSnackbar } from '../../../store/features/snackbars';

const AddSecurityKey: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [stageMessage, setStageMessage] = useState<string | undefined>();
  const [getChallenge] = useWebauthnGenerateChallengeMutation();
  const [savePublicKey] = useWebauthnAddMutation();
  const { login = '' } = useAuthData() || {};
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const closeAddForm = () => {
    setShowAddForm(false);
    setName('');
  };

  const handleNewKeyAdd = async () => {
    try {
      setStageMessage('Waiting for server challenge...');
      const { challenge } = await getChallenge().unwrap();

      setStageMessage('Waiting for input from browser interaction...');
      const registration = await registerSecurityKey({ challenge, username: login });

      setStageMessage('Saving public key...');
      savePublicKey({ publicKeyDto: { registration, name } });

      closeAddForm();
    } catch (e) {
      const text = e instanceof Error ? e.message : 'got unknown error while adding security key';
      dispatch(addSnackbar({ severity: 'error', text }));
    }
    setStageMessage(undefined);
  };

  if (!webauthnAvailable) return;


  if (stageMessage) {
    return (
      <Stack direction='row' spacing={1} alignItems='center'>
        <CircularProgress size={theme.typography.body1.fontSize} />
        <Typography>{stageMessage}</Typography>
      </Stack>
    );
  }

  if (showAddForm) {
    return (
      <>
        <TextField
          sx={{ my: 1 }}
          size='small'
          fullWidth
          label='New key name'
          value={name}
          onChange={({ target: { value } }) => setName(value)}
        />
        <Button sx={{ mr: 1 }} variant='contained' startIcon={<Fingerprint />} onClick={handleNewKeyAdd}>
          Add security key
        </Button>
        <Button variant='outlined' onClick={closeAddForm}>
          Cancel
        </Button>
      </>
    );
  }

  return (
    <Button variant='contained' onClick={() => setShowAddForm(true)}>
      Register new security key
    </Button>
  );
};

export default AddSecurityKey;
