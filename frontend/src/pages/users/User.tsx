import { Delete, ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControl,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { UserDto } from '../../api/api';
import CustomPassword from '../../components/common/CustomPassword';
import useAuthData from '../../hooks/useAuthData';
import UserDisableSwitch from './UserDisableSwitch';
import AdminSwitch from './AdminSwitch';

const User: React.FC<UserDto> = ({ id, login, name, enabled, admin }) => {
  const auth = useAuthData();
  const thisUser = auth?.id === id;
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Stack direction='row' flexGrow={1} alignItems='center'>
          <Typography flexGrow={1} noWrap>
            {login} {name && ` (${name})`}
          </Typography>
          <UserDisableSwitch id={id} thisUser={thisUser} admin={admin} enabled={enabled} />
          <IconButton disabled sx={{ visibility: thisUser ? 'collapse' : 'visible' }}>
            <Delete />
          </IconButton>
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
