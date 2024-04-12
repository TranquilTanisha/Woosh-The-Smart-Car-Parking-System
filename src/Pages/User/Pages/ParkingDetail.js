import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import Image from '../../../Images/location.png';
import '../../../App.css';

const ParkingDetail = () => {
    const { id } = useParams();
    const [organization, setOrganization] = useState(null);
    const [totalParking, setTotalParking] = useState(0);
    const [usedSpots, setUsedSpots] = useState(0);

    useEffect(() => {
        const fetchOrganizationAndParking = async () => {
            const db = getFirestore();

            const orgRef = doc(db, 'organization', id);
            const orgSnap = await getDoc(orgRef);
            if (orgSnap.exists()) {
                setOrganization(orgSnap.data());
            } else {
                console.log('Organization not found');
            }

            var totalParkingCount = 0;
            var occupiedSpots = 0;

            const magnetometersRef = collection(db, 'magnetometers');
            const querySnapshot = await getDocs((magnetometersRef)).then((querySnapshot) => {
                
                querySnapshot.forEach((doc) => {
                    if (doc.data().org_id === id) {
                        setTotalParking(++totalParkingCount);
                        if(doc.data().occupied === true){
                            setUsedSpots(++occupiedSpots);
                        }
                    }
                    
                });
                }
            );
        };

        fetchOrganizationAndParking();
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
                                <div className='pdetails'>
                                <div className='pbasis'>
                                    Basis: {organization.basis}
                                </div>
                                <div className='pcharges'>
                                    Charges: {organization.charges}
                                </div>
                                <div className='pfloors'>
                                    Floors: {organization.floors}
                                </div>
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
                            <div className='pinfo1'><div>Total slots</div><div>{totalParking}</div></div>
                            <div className='pline'></div>
                            <div className='pinfo1'><div>Filled</div><div>{usedSpots}</div></div>
                            <div className='pline'></div>
                            <div className='pinfo1'><div>Vacant</div><div>{totalParking - usedSpots}</div></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ParkingDetail;
