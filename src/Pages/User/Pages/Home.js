import React, { useEffect, useState } from 'react';
import '../../../App.css';
import Bottombar from '../../../Components/Navbar/Bottombar';
import Navbar from '../../../Components/Navbar/Navbar';
import Location from '../Location';
import { Box, Card, CardContent, Typography } from '@mui/material';
import Theme from '../../../Components/DarkMode/DarkMode';
import { getFirestore, collection, query, where, getDocs, doc as firestoreDoc, getDoc } from 'firebase/firestore'; 
import { db } from '../../../Firebase'; 

const Home = () => {
  const [username, setUsername] = useState('');
  const [sessionHistory, setSessionHistory] = useState([]);
  const [orgNames, setOrgNames] = useState([]);

  useEffect(() => {
    const fetchSessionHistory = async () => {
      const userID = localStorage.getItem('userID');
      if (userID) {
        const db = getFirestore();
        const sessionHistoryCollection = collection(db, 'session_history');
        const q = query(sessionHistoryCollection, where('userID', '==', userID));

        try {
          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map(doc => doc.data());
          setSessionHistory(data);
        } catch (error) {
          console.error('Error fetching session history:', error);
        }
      }
    };

    const profile = localStorage.getItem('profile');
    if (profile !== "undefined" && profile !== null) {
      setUsername(JSON.parse(profile).name);
    }

    fetchSessionHistory();
  }, []);

  useEffect(() => {
    const fetchOrgNames = async () => {
      const orgPromises = sessionHistory
        .filter(session => session.entryTime.trim() !== '' && session.exitTime.trim() !== '') 
        .map(async session => {
          const orgID = session.orgID;
          const orgName = await fetchOrgName(orgID);
          return orgName;
        });
      
      const resolvedOrgNames = await Promise.all(orgPromises);
      setOrgNames(resolvedOrgNames);
    };

    fetchOrgNames();
  }, [sessionHistory]);

  const fetchOrgName = async (orgID) => {
    const organizationRef = firestoreDoc(db, 'organization', orgID);
    try {
      const orgSnapshot = await getDoc(organizationRef);
      if (orgSnapshot.exists()) {
        const orgData = orgSnapshot.data();
        return orgData.org_name;
      }
    } catch (error) {
      console.error('Error fetching org name:', error);
    }
    return '';
  };

  return (
    <div>
      <div className='navbar'>
        <Navbar />
      </div>
      <div className='home'>
        <Theme />
        <div>
          <h1 style={{ marginTop: '3rem', textAlign: 'center', color: 'var(--body_color)' }}>Welcome {username}! Explore nearby parking areas. </h1>
        </div>
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <div className='lb'>
            <div className='location_box' >
              <Location />
            </div>
          </div>
        </Box>

        <Typography variant="h4" component="div" style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--body_color)' }}>
        Session History
      </Typography>


        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {sessionHistory
            .filter(session => session.entryTime.trim() !== '' && session.exitTime.trim() !== '')
            .map((session, index) => (
              <Card key={index} variant="outlined" sx={{ minWidth: 275, maxWidth: 350, marginBottom: '20px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
                <CardContent>
                  <Typography variant="body1" component="div" gutterBottom>
                    Organization Name: {orgNames[index]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Entry Time: {session.entryTime}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Exit Time: {session.exitTime}
                  </Typography>
                </CardContent>
              </Card>
            ))
          }
        </div>
      </div>
      <div className='bottombar'>
        <Bottombar value="Home" />
      </div>
    </div>
  );
};

export default Home;
