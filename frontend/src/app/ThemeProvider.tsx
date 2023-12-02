import { FC, PropsWithChildren } from 'react';
import { ThemeProvider as MUIThemeProvider } from '@emotion/react';
import useCreateTheme from '@/hooks/useCreateTheme';

const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const theme = useCreateTheme();
  return <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>;
};

export default ThemeProvider;
