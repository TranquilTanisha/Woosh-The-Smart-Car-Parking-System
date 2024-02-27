import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import { Typography, TextField } from '@mui/material';
import { signInWithPopup } from 'firebase/auth';
import GoogleButton from 'react-google-button';
import Image2 from '../Images/car_parking.jpg';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from '../Firebase.js';
import '../App.css';
import { getDocs, query, where, collection } from 'firebase/firestore';
import { db } from '../Firebase.js';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/">
        MASTEK
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


const defaultTheme = createTheme();

export default function TempUser() {

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
    const email = data.get('email');
    const password = data.get('password');
  
    try {
    
      const usersRef = collection(db, 'users');
      const userQuery = query(usersRef, where('email', '==', email), where('password', '==', password));
      const querySnapshot = await getDocs(userQuery);
  
      if (!querySnapshot.empty) {
        console.log("User successfully logged in!");
        navigate('/'); 
      } else {
        console.error("Invalid email or password");
      }
    } catch (error) {
      console.error("Error signing in: ", error.message);
    }
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${Image2})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ 
                  backgroundColor: '#b81c21',
                  m:1,
                 }}>
                <AccountCircleIcon />
            </Avatar>
            
            
            <Typography component="h1" variant="h5">
            Welcome User!!
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                className="textfield"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                sx={{
                  '&:focus': {
                    backgroundColor: '#b81c40',
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="vehicleNumber"
                label="Vehicle Number"
                type="vehicleNumber"
                id="vehicleNumber"
                autoComplete="vehicleNumber"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: '#b81c21',
                  mt: 1,
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
                textAlign: 'center'
              }}>
              Already have an account?
              </Typography>
              <Typography
              sx={{
                mt: 2,
                mb: 2,
                textAlign: 'center'
              }}>
              OR
              </Typography>
              <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
            <GoogleButton onClick={SignInWithGoogle} />
            <Button
              type="submit"
              variant="contained"
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
            <Copyright />
          </Box>
        </Box>
      </Box>
    </Grid>
  </Grid>
    </ThemeProvider>
  );
}