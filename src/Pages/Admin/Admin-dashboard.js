import React, { useEffect, useState } from 'react';
import { Button, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@mui/material';
import { db } from '../../Firebase';

function AdminDashboard() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    // Fetch employees data from Firebase or your backend
    const fetchEmployees = async () => {
      try {
        // Fetch employees data from Firebase Firestore
        const querySnapshot = await db.collection('employees').get();
        const fetchedEmployees = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEmployees(fetchedEmployees);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleApprove = (employeeId) => {
    // Implement the logic to approve the employee with the given ID
    // This could involve updating the employee's status in the database
    console.log('Approve employee with ID:', employeeId);
  };

  const handleDeny = (employeeId) => {
    // Implement the logic to deny the employee with the given ID
    // This could involve removing the employee's record from the database
    console.log('Deny employee with ID:', employeeId);
  };

  return (
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
                  <Button variant="contained" color="primary" onClick={() => handleApprove(employee.id)}>
                    Approve
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDeny(employee.id)}>
                    Deny
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default AdminDashboard;
