import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import Bottombar from '../../Components/Navbar/Bottombar';
import { Box, Container, Typography, Avatar, CircularProgress, Button } from '@mui/material';
import Image2 from '../../Images/car_park2.png';

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const localProfile = JSON.parse(localStorage.getItem('profile'));
        const userProfile = {
          displayName: localProfile.name,
          email: localProfile.email,
          photoURL: localProfile.photoURL,
          employeeID: localProfile.employeeID,
          parkingID: localProfile.parkingID,
        };
        setProfile(userProfile);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundImage: `url(${Image2})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <Navbar />
      <Container maxWidth="md" sx={{ my: 4, textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '20px', borderRadius: '8px' }}>
        <Typography variant="h3" sx={{ fontFamily: 'Anta', fontStyle: 'normal', color: '#b81c21', fontWeight: 700, mb: 2 }}>Profile</Typography>
        <Box sx={{ p: 4 }}>
          {profile ? (
            <>
              <Avatar alt={profile.displayName} src={profile.photoURL} sx={{ width: 150, height: 150, mb: 2, mx: 'auto', display: 'block' }} />
              <Typography variant="h6" sx={{ mb: 1 }}>Name: {profile.displayName}</Typography>
              <Typography variant="body1">Email: {profile.email}</Typography>
              <Typography variant="body1">Employee ID: {profile.employeeID}</Typography>
              <Typography variant="body1">Workplace Parking ID: {profile.parkingID}</Typography>
              <Button variant="outlined" onClick={handleEditProfile} sx={{ mt: 2 }}>Edit Profile</Button>
            </>
          ) : (
            <CircularProgress sx={{ color: '#b81c21', my: 4 }} />
          )}
        </Box>
      </Container>
      <div className='bottombar'>
        <Bottombar />
      </div>
    </Box>
  );
}

export default Profile;
