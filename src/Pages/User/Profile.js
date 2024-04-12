import SendIcon from '@mui/icons-material/Send';
import { Avatar, Box, Button, CircularProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Bottombar from '../../Components/Navbar/Bottombar';
import Navbar from '../../Components/Navbar/Navbar';
// import Image2 from '../../Images/car_park2.png';

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
          orgID: localProfile.orgID,
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
    <>
    <style>
        {`
          body {
            overflow: hidden;
          }
        `}
      </style>
      <Navbar />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }} className='container hello'>
        <Typography variant="h3" sx={{ fontFamily: 'Anta', fontStyle: 'normal', color: '#b81c21', fontWeight: 700, mb: 2, mt: 2 }}>Profile</Typography>
        <div className='form'>

          <Box sx={{
            display: 'flex',
            justifyContent: 'center'
          }}>
            {profile ? (
              <>
                <div className='box-d'>
                  <Avatar alt={profile.displayName} src={profile.photoURL} sx={{ mx: 'auto', height: '100px', width: '100px', display: 'flex', marginBottom: '2vh' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', padding: '0 1rem' }}>
                    <Typography variant="h6" className='text-box'>Name: <span className='s-text'>{profile.displayName}</span></Typography>
                    <Typography variant="body1" className='text-box'>Email: <span className='s-text'>{profile.email}</span></Typography>
                    <Typography variant="body1" className='text-box'>Employee ID: <span className='s-text'>{profile.employeeID}</span></Typography>
                    <Typography variant="body1" className='text-box'>Org ID: <span className='s-text'>{profile.orgID}</span></Typography>
                    <Button variant="contained" className='btd' onClick={handleEditProfile} sx={{ mt: 2, backgroundColor: '#b81c21' }} endIcon={<SendIcon />}>
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <CircularProgress sx={{ color: '#b81c21', my: 4 }} />
            )}
          </Box>
        </div>
        <div className='bottombar'>
          <Bottombar />
        </div>
      </Box></>
  );
}

export default Profile;
