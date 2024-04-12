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
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../Firebase';
import Image2 from '../../Images/car_parking.jpg';
// import { auth , googleProvider} from "../Firebase";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";

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

function validateEmail(email) {
  // Email regex pattern for basic validation
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

const generateOrgEmployeeMap = async (email) => {
  // Get all the documents from the employees collection

  const querySnapshot = await getDocs(collection(db, "employees"));
  // Create a map of orgID to employeeIDs to email
  const orgEmployeeMap = {};
  querySnapshot.forEach((doc) => {
    // console.log(doc.id, " => ", doc.data());
    // const orgId = doc.id;
    // const empIdToEmail = doc.data();
    orgEmployeeMap[doc.id] = doc.data();
  });
  return orgEmployeeMap;
}

const getEmployeeID = async (orgEmployeeMap, email) => {
  // The orgEmployeeMap is something like this:
  // {
  //   0yCprQEL4XNRO22HxhxMfvSqYSF2: {2220210207: 'shah.dhyey@gmail.com', 2220210236: 'dhyey095534@gmail.com', 2220241203: 'tanisha.kaur@somaiya.edu', 2220245632: 'yatharth.w@somaiya.edu', 2220245879: 'siddhanth.shah@gmail.com'}
  //   8WP1uuHtHnXJ5JcmV8tNbmip9C83: {123456: 'shah.dhyey@gmail.com', 234567891: 'siddhanth.shah@somaiya.edu', 345678912: 'yatharth.w@somaiya.edu', 456789123: 'dhyey095534@gmail.com'}
  //   RdbvNjonv5aYFXZHAB3OFT0gKYR2: {7890: 'fopiri7034@felibg.com', 100100: 'poxiho2585@dacgu.com', 123456: 'ximiw93925@adstam.com', 123456789: 'abc@gmail.com', 234567891: 'def@gmail.com', 345678912: 'ghi@gmail.com'}
  //   om0ZteOhdkg2t1EoLmj6zwiYvyr1: {2220210207: 'shah.dhyey@gmail.com', 2220210236: 'dhyey095534@gmail.com', 2220241203: 'tanisha.kaur@somaiya.edu', 2220245632: 'yatharth.w@somaiya.edu', 2220245879: 'siddhanth.shah@gmail.com'}
  //   }
  // Where the key is the orgID and the value is a map of employeeID to email
  // We need to find the employeeID for the given email
  let employeeID = null;
  for (const orgID in orgEmployeeMap) {
    const employeeMap = orgEmployeeMap[orgID];
    for (const empID in employeeMap) {
      if (employeeMap[empID] === email) {
        employeeID = empID;
        break;
      }
    }
  }
  return employeeID;
}

const getOrgID = async (orgEmployeeMap, employeeID) => {
  // Get the orgID for the given employeeID
  let orgID = null;
  for (const mapOrgID in orgEmployeeMap) {
    const employeeMap = orgEmployeeMap[mapOrgID];
    if (employeeMap[employeeID]) {
      orgID = mapOrgID;
      break;
    }
  }
  return orgID;
}

const defaultTheme = createTheme();

export default function SignUpSide() {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get('name');
    const email = data.get('email');
    const password = data.get('password');
    const confirmPassword = data.get('confirm_password');

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
        const user = userCredential.user;
        const docName = user.uid.toString();
        const userName = user.displayName;
        localStorage.setItem('token', docName);
        // Autofetch the employee ID and org ID
        generateOrgEmployeeMap(email).then((orgEmployeeMap) => {
          getEmployeeID(orgEmployeeMap, email).then((employeeID) => {
            getOrgID(orgEmployeeMap, employeeID).then((orgID) => {
              const userData = {
                email: email,
                name: userName,
                photoURL: user.photoURL ? user.photoURL : '',
                licenseNo1: '',
                licenseNo2: '',
                licenseNo3: '',
                orgID: orgID,
                entryTime: '',
                exitTime: '',
                employeeID: employeeID,
                isVerifiedEmployee: false,
              }
              setDoc(doc(db, "users", docName),
                userData
              );
              localStorage.setItem('profile', JSON.stringify(userData));
              navigate('/');
            });
          });
        });
        // const userData = {
        //   email: email,
        //   name: name,
        //   photoURL: user.photoURL ? user.photoURL : '',
        //   licenseNo1: '',
        //   licenseNo2: '',
        //   licenseNo3: '',
        //   // parkingID: '',
        //   orgID: '',
        //   entryTime: '',
        //   exitTime: '',
        //   employeeID: '',
        //   isVerifiedEmployee: false,
        // }

        // setDoc(doc(db, "users", docName),
        //   userData
        // );
        // localStorage.setItem('profile', JSON.stringify(userData));
        // navigate('/');
      }).catch((error) => {
        console.log(error);
      });
    }
    catch (error) {
      console.log(error);
    }
  };

  //  

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
                name="name"
                label="name"
                type="name"
                id="name"
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
