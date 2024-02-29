import { Route, Routes } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute.js';
import About from './Pages/About.js';
import EditProfile from './Pages/EditProfile.js';
import Location from './Pages/Location.js';
import Login from './Pages/Login.js';
import Profile from './Pages/Profile.js';
import Register from './Pages/Register.js';
import Temp from './Pages/Temp.js';
import Home from './Pages/User/Home.js';
import Navigation from './Pages/User/Navigation.js';
import QR from './Pages/User/QR.js';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<ProtectedRoute />}>
        <Route path='/' element={<Home />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/edit-profile' element={<EditProfile />} />
      </Route>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/about' element={<About />} />
      <Route path='/navigation' element={<Navigation />} />
      <Route path='/qr' element={<QR />} />
      <Route path='/temp' element={<Temp />} />
      <Route path='/location' element={<Location />} />
    </Routes>
  );
}

export default App;
