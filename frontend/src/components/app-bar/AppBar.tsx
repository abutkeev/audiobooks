import { Home } from '@mui/icons-material';
import { IconButton, Toolbar } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const AppBar: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  return (
    <>
      <MuiAppBar position='fixed'>
        <Toolbar>
          {(pathname !== '/' || searchParams.size !== 0) && (
            <IconButton color='inherit' onClick={() => navigate('/')}>
              <Home />
            </IconButton>
          )}
        </Toolbar>
      </MuiAppBar>
      <Toolbar />
      <Outlet />
    </>
  );
};

export default AppBar;
