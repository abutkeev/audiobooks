import { Home, Search as SearchIcon } from '@mui/icons-material';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import Search from './Search';
import { useAppSelector } from '../../store';
import { useState } from 'react';
import AccountMenu from '../account-menu';

interface MobileAppBarProps {
  handleHomeButtonClick(): void;
  showHomeButton: boolean;
}

const MobileAppBar: React.FC<MobileAppBarProps> = ({ handleHomeButtonClick, showHomeButton }) => {
  const title = useAppSelector(({ title }) => title);
  const showSearch = useAppSelector(({ search: { show } }) => show);
  const [showSearchTextfield, setShowSearchTextField] = useState(false);

  return (
    <>
      <AppBar position='fixed'>
        <Toolbar>
          {showSearchTextfield && showSearch ? (
            <Search fullWidth hide={() => setShowSearchTextField(false)} />
          ) : (
            <>
              {showHomeButton && (
                <IconButton color='inherit' onClick={handleHomeButtonClick}>
                  <Home />
                </IconButton>
              )}
              <Typography variant='h6' ml={1} noWrap>
                {title}
              </Typography>
              <Box flexGrow={1} />
              {showSearch && (
                <IconButton color='inherit' onClick={() => setShowSearchTextField(true)}>
                  <SearchIcon />
                </IconButton>
              )}
              <AccountMenu />
            </>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
};

export default MobileAppBar;
