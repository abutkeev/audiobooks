import { RouteObject, RouterProvider, createHashRouter } from 'react-router-dom';
import BookList from '@/pages/BookList';
import BookPage from '@/pages/BookPage';
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';
import Main from './Main';
import { useMemo } from 'react';
import { useAppSelector } from '@/store';
import Login from '@/pages/login';
import Users from '@/pages/users';
import useAuthData from '@/hooks/useAuthData';
import EditBookPage from '@/pages/edit-book';
import NotActive from '@/pages/NotActive';
import SignUp from '@/pages/sign-up';
import Friends from '@/pages/friends';
import Chats from '@/pages/chats';
import Series from '@/pages/series';
import Authors from '@/pages/authors';
import Readers from '@/pages/readers';

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
    path: '/friends',
    element: <Friends />,
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
  {
    path: '/chats',
    element: <Chats />,
  },
  {
    path: '/series',
    element: <Series />,
  },
  {
    path: '/authors',
    element: <Authors />,
  },
  {
    path: '/readers',
    element: <Readers />,
  },
  {
    path: '/edit/:id',
    element: <EditBookPage />,
  },
];

const getRoutes = ({
  token,
  admin,
  enabled,
}: {
  token: string | null;
  admin?: boolean;
  enabled?: boolean;
}): RouteObject[] => {
  if (!token) {
    return [
      {
        path: '/sign-up',
        element: <SignUp />,
      },
      {
        path: '*',
        element: <Login />,
      },
    ];
  }

  if (!enabled) {
    return [
      {
        path: '*',
        element: <NotActive />,
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
  const { admin, enabled } = useAuthData() || {};

  const router = useMemo(
    () =>
      createHashRouter([
        {
          element: <Main />,
          children: getRoutes({ token, admin, enabled }),
        },
      ]),
    [token, admin, enabled]
  );

  return <RouterProvider router={router} />;
};

export default Routes;
