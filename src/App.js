import { Route, Routes } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute.js';
import About from './Pages/User/Pages/About.js';
import EditProfile from './Pages/User/Pages/EditProfile.js';
import Location from './Pages/User/Location.js';
import Login from './Pages/User/Login.js';
import Profile from './Pages/User/Profile.js';
import Register from './Pages/User/Register.js';
import Temp from './Pages/User/Temp.js';
import Home from './Pages/User/Pages/Home.js';
import Navigation from './Pages/User/Pages/Navigation.js';
import QR from './Pages/User/Pages/QR.js';
import AdminDashboard from './Pages/Admin/Admin-dashboard.js';
import AdminLogin from './Pages/Admin/Admin-login.js';
import AdminRegister from './Pages/Admin/Admin-register.js';

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
      <Route path='/admin-dashboard' element={<AdminDashboard />} />
      <Route path='/admin-login' element={<AdminLogin />} />
      <Route path='/admin-register' element={<AdminRegister />} />
    </Routes>
  );
}

export default App;
