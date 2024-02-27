import LoginIcon from '@mui/icons-material/Login';
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

export default function SignInSide() {

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

  function validateEmail(email) {
    // Email regex pattern for basic validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');
  
    // Frontend validations
    if (!validateEmail(email)) {
      alert('Invalid email address');
      return;
    }
  
    if (password.length < 6) {
      alert('Password should be at least 6 characters long');
      return;
    }
  
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
                <LoginIcon />
            </Avatar>
            
            
            <Typography component="h1" variant="h5">
              Login
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
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
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
                Login
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/register" variant="body2">
                    {"Don't have an account? Register"}
                  </Link>
                </Grid>
              </Grid>
              <Typography
              sx={{
                mt: 2,
                mb: 2,
                textAlign: 'center'
              }}>
              OR
              </Typography>
                <GoogleButton onClick={SignInWithGoogle}/>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}