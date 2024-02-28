import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GoogleButton from 'react-google-button';
import Image2 from '../Images/car_parking.jpg';
import { useNavigate } from 'react-router-dom';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase.js';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../Firebase.js';


function TempUser() {
  const navigate = useNavigate();

  const SignInWithGoogle = async() => {
    console.log('Sign in with google');
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      localStorage.setItem('token', result.user.accessToken);
      localStorage.setItem('user', JSON.stringify(result.user));
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get('name');
    const licenseNo1 = data.get('licenseNo1');

    try {
      const userDocRef = doc(db, 'users', name);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        await setDoc(userDocRef, {
          ...userDocSnapshot.data(),
          name: name,
          licenseNo1: licenseNo1,
          licenseNo2: null,
          licenseNo3: null,
          parkingId: null,
          orgID: null,
          employeeID: null,
          isVerifiedEmployee: false,
        });
      } else {
        await setDoc(userDocRef, {
          name: name,
          email: null,
          licenseNo1: licenseNo1,
          licenseNo2: null,
          licenseNo3: null,
          parkingId: null,
          orgID: null,
          employeeID: null,
          isVerifiedEmployee: false,
        });
      }

      console.log('User data updated successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error updating user data: ', error.message);
    }
  };

  return (
    <ThemeProvider theme={createTheme()}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={12}
          sm={5}
          md={7}
          sx={{
            backgroundImage: `url(${Image2})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) => (t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900]),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={7} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ backgroundColor: '#b81c21', m: 1 }}>
              <AccountCircleIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Welcome User!!
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="licenseNo1"
                label="License Number 1"
                type="text"
                id="licenseNo1"
                autoComplete="licenseNo1"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={() => navigate('/')}
                sx={{
                  backgroundColor: '#b81c21',
                  mt: 3,
                  mb: 2,
                  '&:hover': {
                    backgroundColor: '#b81c40',
                  },
                }}
              >
                Enter
              </Button>
              <Typography
                sx={{
                  mt: 2,
                  mb: 2,
                  textAlign: 'center',
                }}
              >
                OR
              </Typography>
              <Typography
                sx={{
                  mt: 2,
                  mb: 2,
                  textAlign: 'center',
                }}
              >
                Already have an account?
              </Typography>
              <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
              <GoogleButton onClick={SignInWithGoogle}/>
                <Button
                  type="button"
                  variant="contained"
                  onClick={() => navigate('/login')}
                  sx={{
                    backgroundColor: '#b81c21',
                    ml: 1,
                    '&:hover': {
                      backgroundColor: '#b81c40',
                    },
                  }}
                >
                  Login
                </Button>
              </Box>
              <Box mt={5}>
                <Typography variant="body2" color="text.secondary" align="center">
                  {'Copyright © '}
                  <Link color="inherit" href="/">
                    MASTEK
                  </Link>{' '}
                  {new Date().getFullYear()}
                  {'.'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default TempUser;
