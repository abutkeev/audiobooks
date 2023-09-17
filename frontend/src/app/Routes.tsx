import { RouteObject, RouterProvider, createHashRouter } from 'react-router-dom';
import BookList from '../pages/BookList';
import BookPage from '../pages/BookPage';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import Main from './Main';
import { useMemo } from 'react';

const authorizedRoutes: RouteObject[] = [
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
];

const Routes: React.FC = () => {
  const router = useMemo(
    () =>
      createHashRouter([
        {
          element: <Main />,
          children: authorizedRoutes,
        },
      ]),
    []
  );

  return <RouterProvider router={router} />;
};

export default Routes;
