import React from 'react';
import ReactDOM from 'react-dom/client';
import './main.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Provider } from 'react-redux';
import { store } from './store';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import BookList from './pages/BookList';
import BookPage from './pages/BookPage';
import AppBar from './app/app-bar/AppBar';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import useCreateTheme from './hooks/useCreateTheme';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';

const router = createHashRouter([
  {
    element: <AppBar />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/books',
        element: <BookList />,
      },
      {
        path: '/book/:id',
        element: <BookPage />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

const App: React.FC = () => {
  const theme = useCreateTheme();
  return (
    <React.StrictMode>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router}></RouterProvider>
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
