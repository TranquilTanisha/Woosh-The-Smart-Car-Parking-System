import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../Firebase';

const SessionHistory = ({ employeeId }) => {
  const [sessionHistoryData, setSessionHistoryData] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchSessionHistory = async () => {
      try {
        const sessionHistoryCollection = collection(db, 'organization');
        const q = query(sessionHistoryCollection, where('employeeId', '==', employeeId));
        const querySnapshot = await getDocs(q);
        const sessions = [];
        querySnapshot.forEach((doc) => {
          // Assuming the document structure contains 'date', 'entryTime', 'exitTime'
          const sessionData = doc.data();
          sessions.push({
            date: sessionData.date,
            entryTime: sessionData.entryTime,
            exitTime: sessionData.exitTime,
          });
        });
        setSessionHistoryData(sessions);
      } catch (error) {
        console.error('Error fetching session history:', error);
      }
    };

    fetchSessionHistory();
  }, [employeeId]);

  return (
    <Box p={2} bgcolor="background.paper" borderRadius={5}>
      <Typography variant="h5" gutterBottom>
        Session History
      </Typography>
      {sessionHistoryData.map((session, index) => (
        <Box key={index} bgcolor="#ffcccc" borderRadius={5} p={2} mb={2}>
          <Typography variant="subtitle1">Date: {session.date}</Typography>
          <Typography variant="body1">Entry Time: {session.entryTime}</Typography>
          <Typography variant="body1">Exit Time: {session.exitTime}</Typography>
          {index !== sessionHistoryData.length - 1 && <Divider />}
        </Box>
      ))}
    </Box>
  );
};

export default SessionHistory;
