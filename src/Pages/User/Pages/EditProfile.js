import { getAuth } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../../Firebase';
import '../../../App.css';

const EditProfile = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    
    const [username, setUsername] = useState('');
    const [employeeID, setEmployeeID] = useState('');
    const [parkingID, setParkingID] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        const uid = user.uid;
        
        if (username !== '' && employeeID === '' && parkingID === '') {
            await updateDoc(doc(db, "users", uid), {
                name: username,
            });
            const profile = JSON.parse(localStorage.getItem('profile'));
            profile.name = username;
            localStorage.setItem('profile', JSON.stringify(profile));
        }

        if (employeeID !== '' && parkingID !== '') {
            await updateDoc(doc(db, "users", uid), {
                employeeID: employeeID,
                parkingID: parkingID
            });
            const profile = JSON.parse(localStorage.getItem('profile'));
            profile.employeeID = employeeID;
            profile.parkingID = parkingID;
            localStorage.setItem('profile', JSON.stringify(profile));
        }

        navigate('/profile');
    }

    return (
        <>
        <div className="container">
        <h1 className="title">Edit Profile</h1>
            <form onSubmit={handleSubmit} className="form">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <label htmlFor="employeeID">Employee ID</label>
                <input type="text" id="employeeID" value={employeeID} onChange={(e) => setEmployeeID(e.target.value)} />
                <label htmlFor="parkingID">Parking ID</label>
                <input type="text" id="parkingID" value={parkingID} onChange={(e) => setParkingID(e.target.value)} />
                <button type="submit">Save</button>
            </form>
            <div className="back-arrow" onClick={() => navigate('/profile')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M6.354 11.354a.5.5 0 0 1 0-.708L2.707 8l3.647-3.646a.5.5 0 0 1 .708.708L4.707 8l2.353 2.354a.5.5 0 0 1-.708.708z"/>
                    <path fillRule="evenodd" d="M7 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1H7.5A.5.5 0 0 1 7 8z"/>
                </svg>
            </div>
        </div>
        </>
    );
}

export default EditProfile;