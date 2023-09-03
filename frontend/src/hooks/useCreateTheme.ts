import { createTheme, useMediaQuery } from '@mui/material';
import { blue, blueGrey, grey } from '@mui/material/colors';
import { useMemo } from 'react';

const useCreateTheme = () => {
  const darkMode = useMediaQuery('(prefers-color-scheme: dark)');
  return useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: darkMode ? { main: blueGrey[300] } : undefined,
          secondary: darkMode ? { main: grey[50] } : undefined,
        },
        components: {
          MuiLink: {
            defaultProps: {
              color: darkMode ? blue[100] : undefined,
            },
          },
        },
      }),
    [darkMode]
  );
};

export default useCreateTheme;
