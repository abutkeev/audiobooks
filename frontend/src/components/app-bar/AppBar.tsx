import { Home } from '@mui/icons-material';
import { Box, Container, IconButton, Toolbar, Typography } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Search from './Search';
import { currentBookVarName } from '../../pages/Home';
import { useAppSelector } from '../../store';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const AppBar: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const title = useAppSelector(({ title }) => title);

  const handleHomeButtonClick = () => {
    localStorage.removeItem(currentBookVarName);
    navigate('/');
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{title}</title>
        </Helmet>
      </HelmetProvider>
      <MuiAppBar position='fixed'>
        <Toolbar>
          {(pathname !== '/' || searchParams.size !== 0) && (
            <IconButton color='inherit' onClick={handleHomeButtonClick}>
              <Home />
            </IconButton>
          )}
          <Typography variant='h6' ml={1}>
            {title}
          </Typography>
          <Box flexGrow={1} />
          <Search />
        </Toolbar>
      </MuiAppBar>
      <Toolbar />
      <Container sx={{ my: 1 }}>
        <Outlet />
      </Container>
    </>
  );
};

export default AppBar;
