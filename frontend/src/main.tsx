import React from 'react';
import ReactDOM from 'react-dom/client';
import './main.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Provider } from 'react-redux';
import { store } from './store';
import useCreateTheme from './hooks/useCreateTheme';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import Routes from './app/Routes';

const App: React.FC = () => {
  const theme = useCreateTheme();
  return (
    <React.StrictMode>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes />
        </ThemeProvider>
      </Provider>
    </React.StrictMode>
  );
};

const rootDiv = document.createElement('div');
rootDiv.setAttribute('id', 'root');
const oldRootDiv = document.getElementById('root')!;
if (oldRootDiv && oldRootDiv.parentElement) {
  oldRootDiv.parentElement.removeChild(oldRootDiv);
}
document.body.appendChild(rootDiv);

ReactDOM.createRoot(rootDiv).render(<App />);
