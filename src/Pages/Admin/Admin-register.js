import React from 'react';
import LoginIcon from '@mui/icons-material/Login';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Image2 from '../../Images/admin_parking.jpg';
import { useNavigate } from 'react-router-dom';
import { db } from '../../Firebase';
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

function validateEmail(email) {
  // Email regex pattern for basic validation
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

const defaultTheme = createTheme();

export default function SignUpSide() {
  const navigate = useNavigate();

  const handleSubmit = async (event) => { 
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const orgName = data.get('org_name');
    const email = data.get('email');
    const password = data.get('password');
    const confirmPassword = data.get('confirm_password');

    // Frontend validations
    if (!validateEmail(email)) {
      alert('Invalid email address');
      return;
    }
  
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
  
    if (password.length < 6) {
      alert('Password should be at least 6 characters long');
      return;
    }

    try {
      const auth = getAuth();
      const email = data.get('email');
      const password = data.get('password');
      createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
        const admin = userCredential.user;
        const docName = admin.uid.toString();
        const adminName = admin.displayName;
        localStorage.setItem('token', docName);
        const adminData = {
          email: email,
          name: adminName,
          parkingID: '',
          orgID: '',
          orgName: orgName,
          employeeID: '',
          isVerifiedAdmin: false,
        }

        setDoc(doc(db, "admins", docName),
          adminData
        );
        localStorage.setItem('profile', JSON.stringify(adminData));
        navigate('/');
      }).catch((error) => {
        console.log(error);
      });
    }
    catch (error) {
      console.log(error);
    }

    navigate('/dashboard');
  };
  
  return (
    <ThemeProvider theme={defaultTheme}>
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
                  m: 0,
                 }}>
              <LoginIcon />
            </Avatar>
            
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Organization Name"
                name="org_name"
                autoComplete="org_name"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
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
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirm_password"
                label="Confirm Password"
                type="password"
                id="confirm_password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ 
                  backgroundColor: '#b81c21',
                  mt: 3,
                  mb: 2,
                  '&:hover': {
                    backgroundColor: '#b81c40',
                  },
                 }}
              >
                Sign Up
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/admin-login" variant="body2">
                    {"Already have an account? Log in"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
