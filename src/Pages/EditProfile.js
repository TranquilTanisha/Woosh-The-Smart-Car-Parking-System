import { getAuth } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../Firebase';

const EditProfile = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user.uid;
    const [username, setUsername] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        updateDoc(doc(db, "users", uid), {
            name: username,
        });
        const profile = JSON.parse(localStorage.getItem('profile'));
        profile.name = username;
        localStorage.setItem('profile', JSON.stringify(profile));
        navigate('/profile');
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <button type="submit">Save</button>
            </form>
        </div>
    );
}

export default EditProfile;