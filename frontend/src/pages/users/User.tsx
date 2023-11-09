import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControl,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { UserDto, useUsersRemoveMutation } from '../../api/api';
import CustomPassword from '../../components/common/CustomPassword';
import useAuthData from '../../hooks/useAuthData';
import UserDisableSwitch from './UserDisableSwitch';
import AdminSwitch from './AdminSwitch';
import DeleteButton from '../../components/common/DeleteButton';

const User: React.FC<UserDto> = ({ id, login, name, enabled, admin }) => {
  const auth = useAuthData();
  const [remove] = useUsersRemoveMutation();

  const thisUser = auth?.id === id;

  const handleRemove = async () => {
    await remove({ id });
  };

  const formatUser = () => `${login} ${name && ` (${name})`}`;

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Stack direction='row' flexGrow={1} alignItems='center'>
          <Typography flexGrow={1} noWrap>
            {formatUser()}
          </Typography>
          <UserDisableSwitch id={id} thisUser={thisUser} admin={admin} enabled={enabled} />
          <DeleteButton
            confirmationTitle='Remove user?'
            confirmationBody={`Remove user ${formatUser()}`}
            onConfirm={handleRemove}
            deleteButtonProps={{ buttonProps: { sx: { visibility: thisUser ? 'collapse' : 'visible' } } }}
          />
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <FormControl fullWidth>
          <Typography variant='body2'>ID: {id}</Typography>
          <TextField label='Name' disabled value={name} sx={{ mt: 2 }} />
          <TextField label='Login' disabled required value={login} sx={{ mt: 2 }} />
          <CustomPassword label='Password' disabled />
          <AdminSwitch id={id} thisUser={thisUser} admin={admin} enabled={enabled} />
        </FormControl>
      </AccordionDetails>
    </Accordion>
  );
};

export default User;
