import { Paper, Stack, Typography } from '@mui/material';
import DeleteButton from '../../../components/common/DeleteButton';
import { useWebauthnRemoveMutation } from '../../../api/api';

interface SecurityKeyProps {
  id: string;
  name: string;
}

const SecurityKey: React.FC<SecurityKeyProps> = ({ name, id }) => {
  const [remove] = useWebauthnRemoveMutation();

  const handleRemove = async () => {
    await remove({ id });
  };

  const keyName = name || id;

  return (
    <Paper square variant='outlined'>
      <Stack spacing={1} direction='row' px={1.5} alignItems='center'>
        <Typography noWrap flexGrow={1}>
          {keyName}
        </Typography>
        <DeleteButton
          confirmationTitle='Remove security key?'
          confirmationBody={`Remove security key ${keyName}`}
          onConfirm={handleRemove}
        />
      </Stack>
    </Paper>
  );
};

export default SecurityKey;
