import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Image from '../../../Images/location.png';
import '../../../App.css';

const ParkingDetail = () => {
    const { id } = useParams();
    const [organization, setOrganization] = useState(null);

    useEffect(() => {
        const fetchOrganization = async () => {
            const db = getFirestore();
            const orgRef = doc(db, 'organization', id);
            const orgSnap = await getDoc(orgRef);
            if (orgSnap.exists()) {
                setOrganization(orgSnap.data());
            } else {
                console.log('Organization not found');
            }
        };

        fetchOrganization();
    }, [id]);

    const goBack = () => {
        window.history.back();
    };

    return (
        <div>
            <AppBar position="static" style={{ backgroundColor: '#b81c21' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={goBack}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" style={{ flexGrow: 1, textAlign: 'center' }}>
                        Parking Detail
                    </Typography>
                </Toolbar>
            </AppBar>
            {organization && (
                <div className='outerBoxi'>
                    <div style={{ marginTop: '20px' }} className='boxi'>
                        <div className='pcontent'>
                            <div className='pPhoto'> <img src={Image} alt="/" className="pimage" /></div>
                            <div className='pdetail'>
                                <div className='pname'>
                                    {organization.org_name}
                                </div>
                                <div className='paddress'>
                                <a className='paddress'
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(organization.location)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View Location on Maps
                                </a>
                                </div>

                            </div>
                        </div>
                        <div className='pinfo'>
                            <div className='pinfo1'><div>Total slots</div><div>{organization.totalParking}</div></div>
                            <div className='pline'></div>
                            <div className='pinfo1'><div>Filled</div><div>{organization.usedSpots}</div></div>
                            <div className='pline'></div>
                            <div className='pinfo1'><div>Vacant</div><div>{organization.vacantSpots}</div></div>
                        </div>
                    </div>
                </div>
            )}
        {/* Embedding iframe
        <div style={{ margin: '20px auto', width: '80%', textAlign: 'center' }}>
        <iframe src="https://html.itch.zone/html/10151287/index.html" allow="autoplay; fullscreen *; geolocation; microphone; camera; midi; monetization; xr-spatial-tracking; gamepad; gyroscope; accelerometer; xr; cross-origin-isolated" allowtransparency="true" webkitallowfullscreen="true" mozallowfullscreen="true" msallowfullscreen="true" frameborder="0" allowfullscreen="true" scrolling="no" id="game_drop"></iframe>
        </div> */}
        </div>
    );
}

export default ParkingDetail;
