import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, FormControl, TextField, Typography } from '@mui/material';

interface UserProps {
  id: string;
  login: string;
}

const User: React.FC<UserProps> = ({ id, login }) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>{login}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <FormControl fullWidth>
          <Typography variant='body2'>ID: {id}</Typography>
          <TextField label='Login' disabled value={login} sx={{ mt: 2 }} />
        </FormControl>
      </AccordionDetails>
    </Accordion>
  );
};

export default User;
