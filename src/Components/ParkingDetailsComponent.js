// ParkingDetailsComponent.js

import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const ParkingDetailsComponent = ({ orgId }) => {
    const [totalParking, setTotalParking] = useState(0);
    const [usedSpots, setUsedSpots] = useState(0);
    const [activeUsers, setActiveUsers] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const db = getFirestore();

            const magnetometersRef = collection(db, 'magnetometers');
            const magnetometersQuery = query(magnetometersRef, where('org_id', '==', orgId));
            const querySnapshot = await getDocs(magnetometersQuery);
            let totalParkingCount = 0;
            let occupiedSpots = 0;
            querySnapshot.forEach((doc) => {
                totalParkingCount++;
                if (doc.data().occupied) {
                    occupiedSpots++;
                }
            });

            setTotalParking(totalParkingCount);
            setUsedSpots(occupiedSpots);
        };

        fetchData();

        const intervalId = setInterval(fetchData, 5000);

        return () => clearInterval(intervalId);
    }, [orgId]);

    useEffect(() => {
        const db = getFirestore();

        const currentDate = new Date().toISOString().split('T')[0];
        const parkingRef = collection(db, 'organization', orgId, currentDate);
        const unsubscribe = onSnapshot(parkingRef, (snapshot) => {
            let entryCounter = 0;
            let exitCounter = 0;
            snapshot.forEach((doc) => {
                const data = doc.data();
                if (data.entry) {
                    entryCounter++;
                }
                if (data.exit) {
                    exitCounter++;
                }
            });
            setActiveUsers(entryCounter - exitCounter);
        });

        return () => unsubscribe();
    }, [orgId]);

    return (
        <div>
            <h2>Parking Details</h2>
            <p>Total Parking: {totalParking}</p>
            <p>Used Spots: {usedSpots}</p>
            <p>Active Users: {activeUsers}</p>
        </div>
    );
}

export default ParkingDetailsComponent;
