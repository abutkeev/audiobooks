import { Home } from '@mui/icons-material';
import { Box, IconButton, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Search from './Search';
import { currentBookVarName } from '../../pages/Home';
import { useAppSelector } from '../../store';
import MobileAppBar from './MobileAppBar';
import AccountMenu from './AccountMenu';

const AppBar: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const title = useAppSelector(({ title }) => title);
  const token = useAppSelector(({ auth: { token } }) => token);

  const handleHomeButtonClick = () => {
    localStorage.removeItem(currentBookVarName);
    navigate('/');
  };

  const showHomeButton = !!token && (pathname !== '/' || new Set(searchParams.keys()).size !== 0);

  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));
  if (mobile) {
    return <MobileAppBar handleHomeButtonClick={handleHomeButtonClick} showHomeButton={showHomeButton} />;
  }

  return (
    <>
      <MuiAppBar position='fixed'>
        <Toolbar>
          {showHomeButton && (
            <IconButton color='inherit' onClick={handleHomeButtonClick}>
              <Home />
            </IconButton>
          )}
          <Typography variant='h6' ml={1} noWrap>
            {title}
          </Typography>
          <Box flexGrow={1} />
          <Search />
          <AccountMenu />
        </Toolbar>
      </MuiAppBar>
      <Toolbar />
    </>
  );
};

export default AppBar;
