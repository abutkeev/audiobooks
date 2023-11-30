import { Container } from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Snackbar from './Snackbar';
import AppBar from './app-bar/AppBar';
import { useAppSelector } from '@/store';
import ReloadPrompt from './ReloadPrompt';
import { Outlet } from 'react-router-dom';
import AddSpeedDial from './add-speed-dial';

const Main: React.FC = () => {
  const title = useAppSelector(({ title }) => title);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{title}</title>
        </Helmet>
      </HelmetProvider>
      <AppBar />
      <Snackbar />
      <Container sx={{ my: 1, maxWidth: 'md' }}>
        <ReloadPrompt />
        <Outlet />
      </Container>
      <AddSpeedDial />
    </>
  );
};

export default Main;
