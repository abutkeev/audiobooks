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
import AppBar from './components/app-bar/AppBar';
import NotFound from './pages/NotFound';
import Home from './pages/Home';

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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  </React.StrictMode>
);
