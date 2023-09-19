import { Paper, Stack, Typography } from '@mui/material';

interface SecurityKeyProps {
  id: string;
  name: string;
}

const SecurityKey: React.FC<SecurityKeyProps> = ({ name, id }) => {
  return (
    <Paper square variant='outlined'>
      <Stack key={id} spacing={1} direction='row' p={1}>
        <Typography noWrap flexGrow={1}>
          {name || id}
        </Typography>
      </Stack>
    </Paper>
  );
};

export default SecurityKey;
