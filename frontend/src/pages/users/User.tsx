import { Delete, ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControl,
  FormControlLabel,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { UserDto } from '../../api/api';

const User: React.FC<UserDto> = ({ id, login, name, enabled, admin }) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography flexGrow={1} noWrap>
          {login} {name && ` (${name})`}
        </Typography>
        <Tooltip title='Enabled'>
          <Switch disabled checked={enabled} />
        </Tooltip>
      </AccordionSummary>
      <AccordionDetails>
        <FormControl fullWidth>
          <Typography variant='body2'>ID: {id}</Typography>
          <TextField label='Login' disabled required value={login} sx={{ mt: 2 }} />
          <TextField label='Name' disabled value={name} sx={{ mt: 2 }} />
          <FormControlLabel control={<Switch checked={admin} disabled />} label='Admin' />
        </FormControl>
      </AccordionDetails>
    </Accordion>
  );
};

export default User;
