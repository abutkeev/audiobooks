import { Check, Close, HourglassTop } from '@mui/icons-material';
import { CircularProgress, useTheme } from '@mui/material';
import { FC } from 'react';

export interface LoginCheckStateProps {
  state?: 'waiting' | 'checking' | 'unused' | 'used';
}

const LoginCheckState: FC<LoginCheckStateProps> = ({ state }) => {
  const { typography } = useTheme();

  switch (state) {
    case 'waiting':
      return <HourglassTop color='primary' />;
    case 'unused':
      return <Check color='success' />;
    case 'used':
      return <Close color='error' />;
    case 'checking':
      return <CircularProgress size={typography.fontSize * 1.5} color='primary' />;
    default:
      return null;
  }
};

export default LoginCheckState;
