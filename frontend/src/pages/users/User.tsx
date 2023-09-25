import { Delete, ExpandMore, Shield } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControl,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { UserDto } from '../../api/api';
import CustomPassword from '../../components/common/CustomPassword';

const User: React.FC<UserDto> = ({ id, login, name, enabled, admin }) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Stack direction='row' flexGrow={1} alignItems='center'>
          <Typography flexGrow={1} noWrap>
            {login} {name && ` (${name})`}
          </Typography>
          {admin && (
            <Tooltip title='Admin'>
              <Shield />
            </Tooltip>
          )}
          <Tooltip title={enabled ? 'Disable' : 'Enable'}>
            <div>
              <Switch disabled checked={enabled} />
            </div>
          </Tooltip>
          <IconButton disabled>
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
          <FormControlLabel control={<Switch checked={admin} disabled />} label='Admin' />
        </FormControl>
      </AccordionDetails>
    </Accordion>
  );
};

export default User;
