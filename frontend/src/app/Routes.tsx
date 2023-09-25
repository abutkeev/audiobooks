import { RouteObject, RouterProvider, createHashRouter } from 'react-router-dom';
import BookList from '../pages/BookList';
import BookPage from '../pages/BookPage';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import Main from './Main';
import { useMemo } from 'react';
import { useAppSelector } from '../store';
import Login from '../pages/login';
import Users from '../pages/users';

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
    path: '/users',
    element: <Users />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

const Routes: React.FC = () => {
  const { token } = useAppSelector(({ auth }) => auth);

  const router = useMemo(
    () =>
      createHashRouter([
        {
          element: <Main />,
          children: token
            ? authorizedRoutes
            : [
                {
                  path: '*',
                  element: <Login />,
                },
              ],
        },
      ]),
    [token]
  );

  return <RouterProvider router={router} />;
};

export default Routes;
