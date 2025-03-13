import { createTheme, useMediaQuery } from '@mui/material';
import { blue, blueGrey, green, grey, red } from '@mui/material/colors';
import { useMemo } from 'react';
import { useAppSelector } from '@/store';

const useCreateTheme = () => {
  const systemDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const { mode } = useAppSelector(({ theme }) => theme);

  const darkMode = mode === 'dark' || (mode === 'auto' && systemDarkMode);

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
                  styleOverrides: {
                    root: {
                      color: blue[100],
                    },
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
