import { useRef } from 'react';
import { Container } from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Snackbar from './Snackbar';
import AppBar from './app-bar/AppBar';
import { useAppSelector } from '@/store';
import ReloadPrompt from './ReloadPrompt';
import { Outlet } from 'react-router-dom';
import Footer from './footer';

const Main: React.FC = () => {
  const title = useAppSelector(({ title }) => title);
  const mainRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{title}</title>
        </Helmet>
      </HelmetProvider>
      <AppBar />
      <Snackbar />
      <Container ref={mainRef} sx={{ my: 1, maxWidth: 'md' }}>
        <ReloadPrompt />
        <Outlet />
      </Container>
      <Footer mainRef={mainRef} />
    </>
  );
};

export default Main;
