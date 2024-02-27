import AdbIcon from '@mui/icons-material/Adb';
import { AppBar, Box, Button, Container, IconButton, Menu, MenuItem, Tooltip, Toolbar, Typography } from '@mui/material';
import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../Firebase';

const pages = ['Home', 'Navigation', 'QR'];
const settings = ['Profile', 'Logout'];

function ResponsiveAppBar() {
  const [setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();

  //eslint-disable-next-line
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };

  const user = JSON.parse(localStorage.getItem('user'));
  console.log(user);

  // If the user signs in with Google, the username will be the user's name, else it will be fetched from firebase
  const username = user.displayName ? user.displayName : user.username;

  return (
    <AppBar position="static" sx={{ backgroundColor: '#b81c21' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', sm: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Roboto Slab',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Carp
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                sx={{ color: 'white', fontWeight: 600 }}
                component={Link}
                to={page === 'Home' ? '/' : `/${page.toLowerCase().replace(' ', '-')}`}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <img alt={username} src={user.photoURL} style={{height: '3.5rem', borderRadius: '50%'}}/>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{
                mt: '45px',
                '& .MuiPaper-root': {
                  backgroundColor: '#f0f0f0',
                  color: '#333',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                },
                '& .MuiTypography-root': {
                  fontSize: '1rem',
                },
                '& .MuiMenuItem-root': {
                  padding: '10px 20px',
                },
              }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={setting === 'Logout' ? handleLogout : handleCloseUserMenu}
                  component={Link}
                  to={setting === 'Profile' ? `/${setting.toLowerCase()}` : null}
                >
                  <Typography textAlign="center" sx={{ color: 'inherit' }}>
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
