import AdbIcon from '@mui/icons-material/Adb';
import { AppBar, Avatar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';
import { getAuth, signOut } from "firebase/auth";
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Theme from '../DarkMode/DarkMode';


const pages = ['Home', 'Navigation', 'QR'];
const settings = ['Profile', 'Logout'];

const ResponsiveAppBar = () => {
  const [setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();

  // eslint-disable-next-line
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
    const auth = getAuth();
    signOut(auth).then(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('profile');
      navigate('/login');
    }).catch((error) => {
      console.log(error);
    });
  };

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const profile = localStorage.getItem('profile')
    if (profile !== "undefined" && profile !== null) {
      setProfile(JSON.parse(profile));
      console.log("Navbar: ", profile);
    }
  }, []);

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
            Woosh
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
            <Theme />
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={profile ? profile.name : ''} src={profile ? profile.photoURL: Avatar} sx={{ height: '3rem', width: '3rem', borderRadius: '50%' }} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{
                mt: '45px',
                '& .MuiPaper-root': {
                  backgroundColor: 'var(--body_color)',
                  color: 'var(--body_background)',
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
