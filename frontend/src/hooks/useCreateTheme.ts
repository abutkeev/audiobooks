import { createTheme, useMediaQuery } from '@mui/material';
import { useMemo } from 'react';

const useCreateTheme = () => {
  const darkMode = useMediaQuery('(prefers-color-scheme: dark)');
  return useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode]
  );
};

export default useCreateTheme;
