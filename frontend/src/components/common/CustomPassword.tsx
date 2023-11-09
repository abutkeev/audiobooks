import { FC, useEffect, useState } from 'react';
import { InputAdornment, IconButton, Tooltip, TextFieldProps, TextField } from '@mui/material';
import { VisibilityOff, Visibility, LockReset } from '@mui/icons-material';
import { generate as generatePassword } from 'generate-password-browser';

type CustomPasswordProps = Omit<TextFieldProps, 'onChange'> & { generate?: boolean; onChange(v: string): void };

const CustomPassword: FC<CustomPasswordProps> = ({ sx, onChange, generate, ...props }) => {
  const { value } = props;
  const passwordGenerationAvailable = !!generate && !!onChange;

  const [showPassword, setShowPassword] = useState(passwordGenerationAvailable);

  useEffect(() => {
    if (!passwordGenerationAvailable) return;
    handleGeneratePassword();
  }, []);

  const handleChange: TextFieldProps['onChange'] = ({ target: { value } }) => {
    if (!onChange) return;
    onChange(value);
  };

  const handleGeneratePassword = () => {
    if (!onChange) return;
    onChange(generatePassword({ excludeSimilarCharacters: true, numbers: true, strict: true }));
  };

  return (
    <TextField
      {...props}
      onChange={handleChange}
      sx={{ mt: 2, ...sx }}
      type={showPassword ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            {passwordGenerationAvailable && (
              <Tooltip title='Generate new password'>
                <IconButton onClick={handleGeneratePassword} size='large'>
                  <LockReset />
                </IconButton>
              </Tooltip>
            )}

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
