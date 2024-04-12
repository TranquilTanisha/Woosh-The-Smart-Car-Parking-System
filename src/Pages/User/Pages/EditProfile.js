import { getAuth } from "firebase/auth";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../../Firebase';
import '../../../App.css';
import Modal from '../../../Components/Modal/Modal';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const EditProfile = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    
    const [username, setUsername] = useState('');
    const [employeeID, setEmployeeID] = useState('');
    const [orgID, setOrgID] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleCloseModal = () => {
        setModalOpen(false);
    }
    const goBack = () => {
        window.history.back();
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        const uid = user.uid;
        if (!username || !employeeID || !orgID) {
            setModalMessage("Please fill in all the fields");
            setModalOpen(true);
            return;
        }
        const orgRef = doc(db, "employees", orgID);
        const orgSnapshot = await getDoc(orgRef);

        if (orgSnapshot.exists()) {
            const orgData = orgSnapshot.data();
            const employeeData = orgData[employeeID];

            if (employeeData && employeeData === user.email) {
                await updateDoc(doc(db, "users", uid), {
                    employeeID: employeeID,
                    orgID: orgID
                });
                const profile = JSON.parse(localStorage.getItem('profile'));
                profile.employeeID = employeeID;
                profile.orgID = orgID;
                localStorage.setItem('profile', JSON.stringify(profile));

                const notificationDocRef = doc(db, "notification", orgID);
                const notificationDocSnapshot = await getDoc(notificationDocRef);

                // eslint-disable-next-line
                if (notificationDocSnapshot.exists()) {
                    // eslint-disable-next-line
                    const notificationData = notificationDocSnapshot.data();
                    await updateDoc(notificationDocRef, {
                        employeeID: uid
                    });
                } else {
                    await setDoc(notificationDocRef, {
                        employeeID: uid
                    });
                }

                navigate('/profile');
            } else {
                setModalMessage("Invalid employeeID for the provided orgID");
                setModalOpen(true);
            }
        } else {
            setModalMessage("Provided orgID does not exist");
            setModalOpen(true);
        }
    }

    return (
        <>
        <style>
        {`
          body {
            overflow: hidden;
          }
        `}
      </style>
        <AppBar position="static" style={{ backgroundColor: '#b81c21' }}>
        <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={goBack}>
                <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" style={{ flexGrow: 1, textAlign: 'center' }}>
            Edit Profile
            </Typography>
        </Toolbar>
    </AppBar>
        <div className="container">
        <div className="form-box">
            <form onSubmit={handleSubmit} className="form">
               
                <label className="label_form" htmlFor="username">Username</label>
                <input className="input_text" type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <label className="label_form" htmlFor="employeeID">Employee ID</label>
                <input className="input_text" type="text" id="employeeID" value={employeeID} onChange={(e) => setEmployeeID(e.target.value)} />
                <label className="label_form" htmlFor="orgID">Organization ID</label>
                <input className="input_text" type="text" id="orgID" value={orgID} onChange={(e) => setOrgID(e.target.value)} />
                <button className="button_submit" type="submit">Save</button>
               
            </form>
            {/* <div className="back-arrow" onClick={() => navigate('/profile')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left  " viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M6.354 11.354a.5.5 0 0 1 0-.708L2.707 8l3.647-3.646a.5.5 0 0 1 .708.708L4.707 8l2.353 2.354a.5.5 0 0 1-.708.708z"/>
                    <path fillRule="evenodd" d="M7 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1H7.5A.5.5 0 0 1 7 8z"/>
                </svg>
            </div> */}
        </div>
        </div>
        <Modal isOpen={modalOpen} message={modalMessage} onClose={handleCloseModal} />
        </>
    );
}

export default EditProfile;
