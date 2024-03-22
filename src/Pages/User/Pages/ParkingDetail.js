import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ParkingDetail = () => {
    const back = () => {
      window.history.back(); 
    };
  return (
    <div>
      <AppBar position="static" style={{ backgroundColor: '#b81c21' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={back}>
            <ArrowBackIcon /> 
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1, textAlign: 'center' }}>
            Parking Detail 
          </Typography>
        </Toolbar>
      </AppBar>
     <div className='outerBoxi'>
     <div style={{ marginTop: '20px' }} className='boxi'> 
       <div className='pcontent'>
        <div className='pPhoto'> <img src='https://via.placeholder.com/150' alt="/" className="pimage" /></div>
        <div className='pdetail'><div className='pname'>
            name</div>
            <div className='paddress'>addressssssssssss sssssss  ssssss </div></div>
       </div>
       <div  className='pinfo'>
<div className='pinfo1'><div>Total slots</div><div>455</div></div>
<div className='pline'></div>
<div className='pinfo1'><div>Filled</div><div>34</div></div>
<div className='pline'></div>
<div className='pinfo1'><div>Vacant</div><div>33</div></div>
       </div>
      </div>
     </div>
    </div>
  );
}

export default ParkingDetail;
