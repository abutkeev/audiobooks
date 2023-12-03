import { FC, useCallback, useEffect, useState } from 'react';
import { InputAdornment, IconButton, Tooltip, TextFieldProps, TextField } from '@mui/material';
import { VisibilityOff, Visibility, LockReset } from '@mui/icons-material';
import { generate as generatePassword } from 'generate-password-browser';
import { useTranslation } from 'react-i18next';

type CustomPasswordProps = Omit<TextFieldProps, 'onChange'> & { generate?: boolean; onChange(v: string): void };

const CustomPassword: FC<CustomPasswordProps> = ({ sx, onChange, generate, ...props }) => {
  const { t } = useTranslation();
  const { value } = props;
  const passwordGenerationAvailable = !!generate && !!onChange;

  const [showPassword, setShowPassword] = useState(passwordGenerationAvailable);

  const handleGeneratePassword = useCallback(() => {
    if (!onChange) return;
    onChange(generatePassword({ excludeSimilarCharacters: true, numbers: true, strict: true }));
  }, [onChange]);

  useEffect(() => {
    if (!passwordGenerationAvailable) return;
    handleGeneratePassword();
  }, [passwordGenerationAvailable, handleGeneratePassword]);

  const handleChange: TextFieldProps['onChange'] = ({ target: { value } }) => {
    if (!onChange) return;
    onChange(value);
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
              <Tooltip title={t('Generate new password')}>
                <IconButton onClick={handleGeneratePassword} size='large'>
                  <LockReset />
                </IconButton>
              </Tooltip>
            )}

            {!!value && (
              <Tooltip title={showPassword ? t('Hide password') : t('Show password')}>
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
