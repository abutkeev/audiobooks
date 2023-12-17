import { useMediaQuery, useTheme } from '@mui/material';

const useMobile = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('sm'));
};

export default useMobile;
