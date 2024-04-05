import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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
                            <div className='pPhoto'> <img src={organization.image} alt="/" className="pimage" /></div>
                            <div className='pdetail'>
                                <div className='pname'>
                                    {organization.org_name}
                                </div>
                                <div className='paddress'>
                                    {organization.location}
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
        </div>
    );
}

export default ParkingDetail;
