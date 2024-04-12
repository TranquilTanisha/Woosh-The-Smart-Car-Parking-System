import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import PersonIcon from '@mui/icons-material/Person';
import { Link, useLocation } from 'react-router-dom';

export default function LabelBottomNavigation() {
  const location = useLocation();
  const [value, setValue] = React.useState('Home');

  React.useEffect(() => {

    const path = location.pathname;

    const pathToValueMap = {
      '/': 'Home',
      '/navigation': 'Navigation',
      '/QR': 'QR',
      '/profile': 'Profile',
    };

    setValue(pathToValueMap[path] || 'Home');
  }, [location]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <BottomNavigation sx={{ backgroundColor: '#b81c21' }} value={value} onChange={handleChange}>
      <BottomNavigationAction
        label="Home"
        value="Home"
        icon={<HomeIcon sx={{ color: value === 'Home' ? 'white' : undefined }} />}
        sx={{
          color: value === 'Home' ? 'white' : undefined,
          '& .MuiBottomNavigationAction-label': {
            color: value === 'Home' ? 'white' : undefined,
          },
        }}
        component={Link}
        to="/"
      />
      <BottomNavigationAction
        label="Navigation"
        value="Navigation"
        icon={<DirectionsCarIcon sx={{ color: value === 'Navigation' ? 'white' : undefined }} />}
        sx={{
          color: value === 'Navigation' ? 'white' : undefined,
          '& .MuiBottomNavigationAction-label': {
            color: value === 'Navigation' ? 'white' : undefined,
          },
        }}
        component={Link}
        to="/navigation"
      />
      <BottomNavigationAction
        label="QR"
        value="QR"
        icon={<QrCodeScannerIcon sx={{ color: value === 'QR' ? 'white' : undefined }} />}
        sx={{
          color: value === 'QR' ? 'white' : undefined,
          '& .MuiBottomNavigationAction-label': {
            color: value === 'QR' ? 'white' : undefined,
          },
        }}
        component={Link}
        to="/QR"
      />
      <BottomNavigationAction
        label="Profile"
        value="Profile"
        icon={<PersonIcon sx={{ color: value === 'Profile' ? 'white' : undefined }} />}
        sx={{
          color: value === 'Profile' ? 'white' : undefined,
          '& .MuiBottomNavigationAction-label': {
            color: value === 'Profile' ? 'white' : undefined,
          },
        }}
        component={Link}
        to="/profile"
      />
    </BottomNavigation>
  );
}
