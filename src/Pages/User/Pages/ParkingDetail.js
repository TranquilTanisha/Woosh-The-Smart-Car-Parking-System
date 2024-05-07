import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams } from 'react-router-dom';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import Image from '../../../Images/location.png';
import '../../../App.css';

const ParkingDetail = () => {
    const { id } = useParams();
    const [organization, setOrganization] = useState(null);
    const [totalParking, setTotalParking] = useState(0);
    const [usedSpots, setUsedSpots] = useState(0);
    const [activeUsers, setActiveUsers] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const db = getFirestore();

            const orgRef = collection(db, 'organization');
            const orgSnapshot = await getDocs(orgRef);
            orgSnapshot.forEach((doc) => {
                if (doc.id === id) {
                    setOrganization(doc.data());
                }
            });

            let totalParkingCount = 0;
            let occupiedSpots = 0;
            const magnetometersRef = collection(db, 'magnetometers');
            const magnetometersQuery = query(magnetometersRef, where('org_id', '==', id));
            const querySnapshot = await getDocs(magnetometersQuery);
            querySnapshot.forEach((doc) => {
                totalParkingCount++;
                if (doc.data().occupied) {
                    occupiedSpots++;
                }
            });

            const currentDate = new Date().toISOString().split('T')[0];
            console.log(currentDate)
            const parkingRef = collection(db, 'organization', id, currentDate);
            const parkingSnapshot = await getDocs(parkingRef);
            let entryCounter = 0;
            let exitCounter = 0;
            parkingSnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.entry) {
                    entryCounter++;
                }
                if (data.exit) {
                    exitCounter++;
                }
            });

            setTotalParking(totalParkingCount);
            setUsedSpots(occupiedSpots);
            setActiveUsers(entryCounter - exitCounter);
        };

        fetchData();

        const intervalId = setInterval(fetchData, 30000);

        return () => clearInterval(intervalId);
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
                            <div className='pline'></div>
                            <div className='pinfo1'><div>Active Users</div><div>{activeUsers}</div></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ParkingDetail;



//FIREBASE CONNECTION(NOT CONNECTED DUE TO READS AND WRITES)

// import React, { useState, useEffect } from 'react';
// import AppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import { useParams } from 'react-router-dom';
// import { getFirestore, collection, getDocs, query, where, doc, setDoc, updateDoc } from 'firebase/firestore'; // Import setDoc and updateDoc
// import Image from '../../../Images/location.png';
// import '../../../App.css';

// const ParkingDetail = () => {
//     const { id } = useParams();
//     const [organization, setOrganization] = useState(null);
//     const [totalParking, setTotalParking] = useState(0);
//     const [usedSpots, setUsedSpots] = useState(0);
//     const [activeUsers, setActiveUsers] = useState(0);

//     useEffect(() => {
//         const fetchData = async () => {
//             const db = getFirestore();

//             const orgRef = collection(db, 'organization');
//             const orgSnapshot = await getDocs(orgRef);
//             orgSnapshot.forEach((doc) => {
//                 if (doc.id === id) {
//                     setOrganization(doc.data());
//                 }
//             });

//             let totalParkingCount = 0;
//             let occupiedSpots = 0;
//             const magnetometersRef = collection(db, 'magnetometers');
//             const magnetometersQuery = query(magnetometersRef, where('org_id', '==', id));
//             const querySnapshot = await getDocs(magnetometersQuery);
//             querySnapshot.forEach((doc) => {
//                 totalParkingCount++;
//                 if (doc.data().occupied) {
//                     occupiedSpots++;
//                 }
//             });

//             const currentDate = new Date().toISOString().split('T')[0];
//             const parkingRef = collection(db, 'organization', id, currentDate);
//             const parkingSnapshot = await getDocs(parkingRef);
//             let entryCounter = 0;
//             let exitCounter = 0;
//             parkingSnapshot.forEach((doc) => {
//                 const data = doc.data();
//                 if (data.entry) {
//                     entryCounter++;
//                 }
//                 if (data.exit) {
//                     exitCounter++;
//                 }
//             });

//             setTotalParking(totalParkingCount);
//             setUsedSpots(occupiedSpots);
//             setActiveUsers(entryCounter - exitCounter);
//         };

//         fetchData();

//         const intervalId = setInterval(fetchData, 5000);

//         return () => clearInterval(intervalId);
//     }, [id]);

//     useEffect(() => {
//         const updateParkingDetails = async () => {
//             const db = getFirestore();

//             // Update existing document with new values
//             try {
//                 await updateDoc(doc(db, 'parking_details', id), {
//                     total_slots: totalParking,
//                     filled_slots: usedSpots,
//                     vacant_slots: totalParking - usedSpots,
//                     active_users: activeUsers
//                 });
//                 console.log('Parking details document updated in Firestore');
//             } catch (error) {
//                 console.error('Error updating parking details document in Firestore: ', error);
//             }
//         };

//         if (organization !== null) {
//             updateParkingDetails();
//         }
//     }, [id, totalParking, usedSpots, activeUsers, organization]);

//     const goBack = () => {
//         window.history.back();
//     };

//     return (
//         <div>
//             <AppBar position="static" style={{ backgroundColor: '#b81c21' }}>
//                 <Toolbar>
//                     <IconButton edge="start" color="inherit" aria-label="menu" onClick={goBack}>
//                         <ArrowBackIcon />
//                     </IconButton>
//                     <Typography variant="h6" style={{ flexGrow: 1, textAlign: 'center' }}>
//                         Parking Detail
//                     </Typography>
//                 </Toolbar>
//             </AppBar>
//             {organization && (
//                 <div className='outerBoxi'>
//                     <div style={{ marginTop: '20px' }} className='boxi'>
//                         <div className='pcontent'>
//                             <div className='pPhoto'> <img src={Image} alt="/" className="pimage" /></div>
//                             <div className='pdetail'>
//                                 <div className='pname'>
//                                     {organization.org_name}
//                                 </div>
//                                 <div className='pdetails'>
//                                     <div className='pbasis'>
//                                         Basis: {organization.basis}
//                                     </div>
//                                     <div className='pcharges'>
//                                         Charges: {organization.charges}
//                                     </div>
//                                     <div className='pfloors'>
//                                         Floors: {organization.floors}
//                                     </div>
//                                 </div>
//                                 <div className='paddress'>
//                                     <a className='paddress'
//                                         href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(organization.location)}`}
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                     >
//                                         View Location on Maps
//                                     </a>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className='pinfo'>
//                             <div className='pinfo1'><div>Total slots</div><div>{totalParking}</div></div>
//                             <div className='pline'></div>
//                             <div className='pinfo1'><div>Filled</div><div>{usedSpots}</div></div>
//                             <div className='pline'></div>
//                             <div className='pinfo1'><div>Vacant</div><div>{totalParking - usedSpots}</div></div>
//                             <div className='pline'></div>
//                             <div className='pinfo1'><div>Active Users</div><div>{activeUsers}</div></div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default ParkingDetail;
