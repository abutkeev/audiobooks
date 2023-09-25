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
import useAuthData from '../hooks/useAuthData';

const userRoutes: RouteObject[] = [
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

const adminRoutes: RouteObject[] = [
  {
    path: '/users',
    element: <Users />,
  },
];

const getRoutes = ({ token, admin }: { token: string | null; admin?: boolean }): RouteObject[] => {
  if (!token) {
    return [
      {
        path: '*',
        element: <Login />,
      },
    ];
  }

  if (admin) {
    return adminRoutes.concat(userRoutes);
  }

  return userRoutes;
};

const Routes: React.FC = () => {
  const { token } = useAppSelector(({ auth }) => auth);
  const { admin } = useAuthData() || {};

  const router = useMemo(
    () =>
      createHashRouter([
        {
          element: <Main />,
          children: getRoutes({ token, admin }),
        },
      ]),
    [token]
  );

  return <RouterProvider router={router} />;
};

export default Routes;
