import { FC, useState } from 'react';
import { InputAdornment, IconButton, Tooltip, TextFieldProps, TextField } from '@mui/material';
import { VisibilityOff, Visibility } from '@mui/icons-material';

const CustomPassword: FC<TextFieldProps> = ({ sx, ...props }) => {
  const { value } = props;

  const [showPassword, setShowPassword] = useState(false);
  return (
    <TextField
      {...props}
      sx={{ mt: 2, ...sx }}
      type={showPassword ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            {!!value && (
              <Tooltip title={showPassword ? 'Hide password' : 'Show password'}>
                <IconButton
                  aria-label='Toggle password visibility'
                  onClick={() => setShowPassword(!showPassword)}
                  size='large'
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </Tooltip>
            )}
          </InputAdornment>
        ),
      }}
    />
  );
};

export default CustomPassword;
