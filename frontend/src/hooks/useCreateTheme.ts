import { createTheme, useMediaQuery } from '@mui/material';
import { blue, blueGrey, green, grey, red } from '@mui/material/colors';
import { useMemo } from 'react';
import useSelectedTheme from './useSelectedTheme';

const useCreateTheme = () => {
  const systemDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [theme] = useSelectedTheme();

  const darkMode = theme === 'dark' || (theme === 'auto' && systemDarkMode);

  return useMemo(
    () =>
      createTheme(
        darkMode
          ? {
              palette: {
                mode: 'dark',
                primary: { main: blueGrey[300] },
                secondary: { main: grey[50] },
              },
              components: {
                MuiLink: {
                  defaultProps: {
                    color: blue[100],
                  },
                },
              },
            }
          : {
              palette: { mode: 'light' },
              components: {
                MuiBadge: {
                  styleOverrides: {
                    colorSuccess: { backgroundColor: green[500] },
                    colorError: { backgroundColor: red[500] },
                  },
                },
              },
            }
      ),
    [darkMode]
  );
};

export default useCreateTheme;
