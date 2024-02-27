import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LoginIcon from '@mui/icons-material/Login';
import Image2 from '../Images/car_parking.jpg';
import { useNavigate } from 'react-router-dom';
import { db } from '../Firebase';
// import { auth , googleProvider} from "../Firebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 
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

export default function SignUpSide() {
  const navigate = useNavigate();

//on submit redirect to login page
  const handleSubmit = async (event) => { 
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if(data.get('password') === data.get('confirm_password')) {
      try {
        const auth = getAuth();
        const email = data.get('email');
        const password = data.get('password');
        createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
          const user = userCredential.user;
          const userUidString = user.uid.toString();
          const userName = user.displayName;
          console.log(userUidString);
          console.log(userName);
          navigate('/login');
          
          const docName = userUidString;
          setDoc(doc(db, "users", docName), {
            email: data.get('email'),
            name: userName,
            licenseNo1: '',
            licenseNo2: '',
            licenseNo3: '',
            parkingId: '',
            orgID: '',
            employeeID: '',
            isVerifiedEmployee: false,
          });
          // const docRef = addDoc(collection(db, "users"), { 
          //   licenseNo: '',
          //   email: data.get('email'),
          //   name: userName,
          // });
        }).catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
        });
      }
      catch (error) {
        console.log(error);
      }
    }
    else {
      alert('Passwords do not match');
    }
  };
  
  //   try {
  //     const docRef = await addDoc(collection(db, "users"), { 
  //       first_name: data.get('first_name'),
  //       last_name: data.get('last_name'),
  //       License_Plate_no: data.get('License_Plate_no'),
  //       email: data.get('email'),
  //       password: data.get('password'),
  //     });
  //     try {
  //       localStorage.setItem('token', docRef.id);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //     navigate('/');
  //     console.log("Document written with ID: ", docRef.id);
  //   } catch (error) {
  //     console.error("Error adding document: ", error);
  //   }
  // };

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
                  m: 0,
                 }}>

                <LoginIcon />
            </Avatar>
            
            
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  {/* <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="first_name"
                    label="First Name"
                    name="first_name"
                    autoComplete="first_name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="last_name"
                    label="Last Name"
                    name="last_name"
                    autoComplete="last_name"
                  /> */}
                </Grid>
              </Grid>
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
              {/* <TextField
                margin="normal"
                required
                fullWidth
                id="License_Plate_no"
                label="License Plate Number"
                name="License_Plate_no"
                autoComplete="License_Plate_no"
                inputProps={{
                  maxLength: 10
                }}
                autoFocus
              /> */}
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
              {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
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
                  <Link href="/login" variant="body2">
                    {"Already have an account? Log in"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
