import { store } from '@/store';
import { CssBaseline } from '@mui/material';
import React from 'react';
import { Provider } from 'react-redux';
import ThemeProvider from './ThemeProvider';
import Routes from './Routes';

const App: React.FC = () => (
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <CssBaseline />
        <Routes />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

export default App;
