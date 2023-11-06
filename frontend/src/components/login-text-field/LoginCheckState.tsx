import { Check, Close, HourglassTop } from '@mui/icons-material';
import { CircularProgress, useTheme } from '@mui/material';
import { FC } from 'react';

export interface LoginCheckStateProps {
  state?: 'waiting' | 'checking' | 'unused' | 'used';
  validType: 'used' | 'unused';
}

const Valid = () => <Check color='success' />;
const Invalid = () => <Close color='error' />;

const LoginCheckState: FC<LoginCheckStateProps> = ({ state, validType }) => {
  const { typography } = useTheme();

  switch (state) {
    case 'waiting':
      return <HourglassTop color='primary' />;
    case 'unused':
    case 'used':
      return validType === state ? <Valid /> : <Invalid />;
    case 'checking':
      return <CircularProgress size={typography.fontSize * 1.5} color='primary' />;
    default:
      return null;
  }
};

export default LoginCheckState;
