import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import '../../../App.css';
import Navbar from '../../../Components/Navbar/Navbar';
import Bottombar from '../../../Components/Navbar/Bottombar';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import Image from '../../../Images/location.png';
import Theme from '../../../Components/DarkMode/DarkMode';

// eslint-disable-next-line
const placeholderImage = 'https://via.placeholder.com/150';

function Navigation() {
  const [organizations, setOrganizations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrganizations = async () => {
    const db = getFirestore();
    const organizationsCollection = collection(db, 'organization');
    const snapshot = await getDocs(organizationsCollection);
    const organizationsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setOrganizations(organizationsData);
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleSearch = event => {
    setSearchQuery(event.target.value);
  };

  const filteredOrganizations = organizations.filter(org =>
    org.org_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
    <div className='navigation'>
    <Theme />
    <div>
      <div className="navbar">
        <Navbar />
      </div>
      <div className="navigation-container">
        <div className="search-bar">
          <input type="text" className="search-input" placeholder="Search..." onChange={handleSearch} />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className="search-icon"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
        </div>
        <div className="squares-container">
          {filteredOrganizations.map(org => (
            <Card className="square" key={org.id}>
              <CardContent className="card-content">
                <img src={Image} alt="Organization" className="image" />
                <Typography 
                  variant="h6" 
                  component={Link} 
                  to={`/navigation/detail/${org.id}`} 
                  className="name"
                >
                  {org.org_name}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="textSecondary" 
                  component="div" 
                  className="location"
                >
                  <Link 
                    to={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(org.location)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Get Directions
                  </Link>
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="bottombar">
        <Bottombar />
      </div>
    </div>
    </div>
    </>
  );
}

export default Navigation;
