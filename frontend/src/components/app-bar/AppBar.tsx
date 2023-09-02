import { Home } from '@mui/icons-material';
import { Box, IconButton, Toolbar } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Search from './Search';
import { currentBookVarName } from '../../pages/Home';

const AppBar: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  const handleHomeButtonClick = () => {
    localStorage.removeItem(currentBookVarName);
    navigate('/');
  };

  return (
    <>
      <MuiAppBar position='fixed'>
        <Toolbar>
          {(pathname !== '/' || searchParams.size !== 0) && (
            <IconButton color='inherit' onClick={handleHomeButtonClick}>
              <Home />
            </IconButton>
          )}
          <Box flexGrow={1} />
          <Search />
        </Toolbar>
      </MuiAppBar>
      <Toolbar />
      <Outlet />
    </>
  );
};

export default AppBar;
