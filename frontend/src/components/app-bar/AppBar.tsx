import { Home } from '@mui/icons-material';
import { IconButton, Toolbar } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const AppBar: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <>
      <MuiAppBar position='fixed'>
        <Toolbar>
          {pathname !== '/' && (
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
