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
import MainPage from './pages/MainPage';
import BookPage from './pages/BookPage';
import AppBar from './components/app-bar/AppBar';

const router = createHashRouter([
  {
    element: <AppBar />,
    children: [
      {
        path: '/',
        element: <MainPage />,
      },
      {
        path: '/book/:id',
        element: <BookPage />,
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
