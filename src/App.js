import { Route, Routes } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute.js';
import About from './Pages/About.js';
import Login from './Pages/Login.js';
import Profile from './Pages/Profile.js';
import Register from './Pages/Register.js';
import Home from './Pages/User/Home.js';
import QR from './Pages/User/QR.js';
import Navigation from './Pages/User/Navigation.js';


const App = () => {
  return (
      <Routes>
      <Route path='/' element ={<ProtectedRoute/>}>
        <Route path='/' element ={<Home/>} />
      </Route>
      <Route path='/login' element ={<Login/>} />
      <Route path='/register' element ={<Register/>} />
      <Route path='/' element ={<ProtectedRoute/>}>
        <Route path='/about' element ={<About/>} />
      </Route>

      <Route path='/navigation' element ={<Navigation/>} />
      <Route path='/qr' element ={<QR/>} />
      <Route path='/profile' element ={<Profile/>} />
      </Routes>

  );
}

export default App;
