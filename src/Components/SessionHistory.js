import React from 'react';
import { Box, Typography, Divider, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const SessionHistory = () => {
  const sessionHistoryData = [
    { date: '2022-03-14', entryTime: '10:30 AM', exitTime: '12:45 PM', amount: '$10' },
    { date: '2022-03-13', entryTime: '09:15 AM', exitTime: '11:30 AM', amount: '$8' },
    { date: '2022-03-12', entryTime: '11:00 AM', exitTime: '01:20 PM', amount: '$12' },
  ];

  const theme = useTheme();
  // eslint-disable-next-line
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
          <Typography variant="body1">Amount Paid: {session.amount}</Typography>
          {index !== sessionHistoryData.length - 1 && <Divider />}
        </Box>
      ))}
    </Box>
  );
};

export default SessionHistory;
