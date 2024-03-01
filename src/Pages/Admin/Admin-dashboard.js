import React, { useEffect, useState } from 'react';
import { Button, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@mui/material';
import { db } from '../../Firebase';
import AdminNavbar from './Admin-navbar';

function AdminDashboard() {
  // Dummy data for employees
  const employees = [
    { id: 1, email: 'employee1@example.com' },
    { id: 2, email: 'employee2@example.com' },
    { id: 3, email: 'employee3@example.com' },
  ];

  const handleApprove = (employeeId) => {
    // Handle approve logic
    console.log('Approving employee with ID:', employeeId);
  };

  const handleDeny = (employeeId) => {
    // Handle deny logic
    console.log('Denying employee with ID:', employeeId);
  };

  return (
    <>
      <div>
        <AdminNavbar />
      </div>
      <Container>
        <Typography variant="h4" align="center" gutterBottom>
          Admin Dashboard
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee ID</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.id}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>
                  <div style={{ marginTop: '10px' }}>
                  <Button variant="contained" style={{ backgroundColor: '#355E3B' }} onClick={() => handleApprove(employee.id)}>
                    Approve
                  </Button>
                  <span style={{ marginRight: '10px' }} />
                  <Button variant="contained" style={{ backgroundColor: '#b81c21' }} color="secondary" onClick={() => handleDeny(employee.id)}>
                    Deny
                  </Button>
                </div>

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
}

export default AdminDashboard;



// const [employees, setEmployees] = useState([]);

//   useEffect(() => {
//     // Fetch employees data from Firebase or your backend
//     const fetchEmployees = async () => {
//       try {
//         // Fetch employees data from Firebase Firestore
//         const querySnapshot = await db.collection('employees').get();
//         const fetchedEmployees = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         setEmployees(fetchedEmployees);
//       } catch (error) {
//         console.error('Error fetching employees:', error);
//       }
//     };

//     fetchEmployees();
//   }, []);
