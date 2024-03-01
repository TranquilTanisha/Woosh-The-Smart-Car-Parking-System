import { getAuth } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../../Firebase';

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
        // If the username is blank, do no update it. Else update it
        // If the employeeID is filled, check if the parkingID is filled. If both are not filled, do not update it. Else update it
        
        if (username !== '' && employeeID === '' && parkingID === '') {
            console.log("Filled username and blank employeeID and parkingID");
            await updateDoc(doc(db, "users", uid), {
                name: username,
            });
            const profile = JSON.parse(localStorage.getItem('profile'));
            profile.name = username;
            localStorage.setItem('profile', JSON.stringify(profile));
        }

        if (employeeID !== '' && parkingID !== '') {
            console.log("Filled employeeID and parkingID");
            await updateDoc(doc(db, "users", uid), {
                employeeID: employeeID,
                parkingID: parkingID
            });
            const profile = JSON.parse(localStorage.getItem('profile'));
            profile.employeeID = employeeID;
            profile.parkingID = parkingID;
            localStorage.setItem('profile', JSON.stringify(profile));
        }

        // If the username is filled and employeeID and parkingID are not filled, update only the username

        

        navigate('/profile');

        // e.preventDefault();
        // updateDoc(doc(db, "users", uid), {
        //     name: username,
        // });
        // const profile = JSON.parse(localStorage.getItem('profile'));
        // profile.name = username;
        // localStorage.setItem('profile', JSON.stringify(profile));
        // navigate('/profile');
    }

    return (
        <div>
            <form onSubmit={handleSubmit} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <label htmlFor="employeeID">Employee ID</label>
                <input type="text" id="employeeID" value={employeeID} onChange={(e) => setEmployeeID(e.target.value)} />
                <label htmlFor="parkingID">Parking ID</label>
                <input type="text" id="parkingID" value={parkingID} onChange={(e) => setParkingID(e.target.value)} />
                <button type="submit">Save</button>
            </form>
        </div>
    );
}

export default EditProfile;